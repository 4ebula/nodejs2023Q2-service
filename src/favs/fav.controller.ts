import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavService } from './fav.service';
import { Fav } from 'src/db/fav';
import { IdParam } from 'src/shared/models/shared.model';
import { Messages } from './models';

@Controller('favs')
export class FavController {
  constructor(private favService: FavService) {}

  @Get()
  getFavs(): Fav {
    return this.favService.getFavs();
  }

  @Post('track/:id')
  addTrack(@Param() { id }: IdParam) {
    const res = this.favService.addTrack(id);

    if (!res) {
      throw new UnprocessableEntityException(Messages.TrackNotFound);
    }
  }

  @Post('album/:id')
  addAlbum(@Param() { id }: IdParam) {
    const res = this.favService.addAlbum(id);

    if (!res) {
      throw new UnprocessableEntityException(Messages.AlbumNotFound);
    }
  }

  @Post('artist/:id')
  addArtist(@Param() { id }: IdParam) {
    const res = this.favService.addArtist(id);

    if (!res) {
      throw new UnprocessableEntityException(Messages.ArtistNotFound);
    }
  }

  @Delete('track/:id')
  @HttpCode(204)
  deleteTrack(@Param() { id }: IdParam) {
    const res = this.favService.deleteTrack(id);

    if (!res) {
      throw new NotFoundException(Messages.TrackNotFound);
    }
  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteAlbum(@Param() { id }: IdParam) {
    const res = this.favService.deleteAlbum(id);

    if (!res) {
      throw new NotFoundException(Messages.AlbumNotFound);
    }
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteArtist(@Param() { id }: IdParam) {
    const res = this.favService.deleteArtist(id);

    if (!res) {
      throw new NotFoundException(Messages.ArtistNotFound);
    }
  }
}
