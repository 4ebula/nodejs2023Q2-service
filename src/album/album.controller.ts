import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ValidationPipe,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from 'src/db/album';
import { IdParam } from 'src/shared/models/shared.model';
import { Messages } from './models/messages';
import { CreateAlbumDto, UpdateAlbumdDto } from './models';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  getAlbums(): Album[] {
    return this.albumService.getAlbums();
  }

  @Get(':id')
  getAlbum(@Param() { id }: IdParam): Album {
    const user = this.albumService.getAlbum(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
    return user;
  }

  @Post()
  createAlbum(@Body(new ValidationPipe()) dto: CreateAlbumDto): Album {
    return this.albumService.createAlbum(dto);
  }

  @Put(':id')
  udapteAlbum(
    @Param() { id }: IdParam,
    @Body(new ValidationPipe()) dto: UpdateAlbumdDto,
  ): Album {
    const user = this.albumService.updateAlbum(id, dto);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }

    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param() { id }: IdParam): void {
    const user = this.albumService.deleteAlbum(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
  }
}
