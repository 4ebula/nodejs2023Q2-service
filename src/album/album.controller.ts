import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ValidationPipe,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { Album } from '@prisma/client';
import { RemoveFavoritedInterceptor } from 'src/shared/interceptors';
import { ErrorService } from 'src/shared/services';
import { AlbumService } from './album.service';
import { IdParam } from 'src/shared/models';
import { CreateAlbumDto, UpdateAlbumdDto } from './models';

@Controller('album')
@UseInterceptors(new RemoveFavoritedInterceptor())
export class AlbumController extends ErrorService {
  constructor(private albumService: AlbumService) {
    super();
  }

  @Get()
  async getAlbums(): Promise<Album[]> {
    return await this.albumService.getAlbums();
  }

  @Get(':id')
  async getAlbum(@Param() { id }: IdParam): Promise<Album> {
    try {
      return await this.albumService.getAlbum(id);
    } catch (err) {
      this.throwExceptions('Album', err);
    }
  }

  @Post()
  async createAlbum(
    @Body(new ValidationPipe()) dto: CreateAlbumDto,
  ): Promise<Album> {
    return await this.albumService.createAlbum(dto);
  }

  @Put(':id')
  async udapteAlbum(
    @Param() { id }: IdParam,
    @Body(new ValidationPipe()) dto: UpdateAlbumdDto,
  ): Promise<Album> {
    try {
      return await this.albumService.updateAlbum(id, dto);
    } catch (err) {
      this.throwExceptions('Album', err);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() { id }: IdParam): Promise<void> {
    try {
      await this.albumService.deleteAlbum(id);
    } catch (err) {
      this.throwExceptions('Album', err);
    }
  }
}
