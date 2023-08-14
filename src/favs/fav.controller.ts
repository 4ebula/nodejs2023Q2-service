import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
  UseInterceptors,
} from '@nestjs/common';
import { Album, Artist, Favorites, Track } from '@prisma/client';
import {
  RemoveFavIdInterceptor,
  RemoveFavoritedInterceptor,
} from 'src/shared/interceptors';
import { IdParam } from 'src/shared/models';
import { FavService } from './fav.service';

@Controller('favs')
export class FavController {
  constructor(private favService: FavService) {}

  @Get()
  @UseInterceptors(new RemoveFavIdInterceptor())
  async getFavs(): Promise<Favorites> {
    return await this.favService.getFavs();
  }

  @Post('track/:id')
  @UseInterceptors(new RemoveFavoritedInterceptor())
  async addTrack(@Param() { id }: IdParam): Promise<Track> {
    try {
      return await this.favService.addTrack(id);
    } catch (err) {
      throw new UnprocessableEntityException('Track not found');
    }
  }

  @Post('album/:id')
  @UseInterceptors(new RemoveFavoritedInterceptor())
  async addAlbum(@Param() { id }: IdParam): Promise<Album> {
    try {
      return await this.favService.addAlbum(id);
    } catch (err) {
      throw new UnprocessableEntityException('Album not found');
    }
  }

  @Post('artist/:id')
  @UseInterceptors(new RemoveFavoritedInterceptor())
  async addArtist(@Param() { id }: IdParam): Promise<Artist> {
    try {
      return await this.favService.addArtist(id);
    } catch (err) {
      throw new UnprocessableEntityException('Artist not found');
    }
  }

  @Delete('track/:id')
  @HttpCode(204)
  async deleteTrack(@Param() { id }: IdParam) {
    try {
      await this.favService.deleteTrack(id);
    } catch (err) {
      throw new NotFoundException('Track not found in favs');
    }
  }

  @Delete('album/:id')
  @HttpCode(204)
  async deleteAlbum(@Param() { id }: IdParam) {
    try {
      await this.favService.deleteAlbum(id);
    } catch (err) {
      throw new NotFoundException('Album not found in favs');
    }
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async deleteArtist(@Param() { id }: IdParam): Promise<void> {
    try {
      await this.favService.deleteArtist(id);
    } catch (err) {
      throw new NotFoundException('Artist not found in favs');
    }
  }
}
