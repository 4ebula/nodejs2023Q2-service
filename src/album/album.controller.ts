import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
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
  @UseInterceptors(ClassSerializerInterceptor)
  getUsers(): Album[] {
    return this.albumService.getUsers();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  getUser(@Param() { id }: IdParam): Album {
    const user = this.albumService.getUser(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
    return user;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  createUser(@Body(new ValidationPipe()) dto: CreateAlbumDto): Album {
    return this.albumService.createAlbum(dto);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  changePassword(
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
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  delete(@Param() { id }: IdParam): void {
    const user = this.albumService.deleteAlbum(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
  }
}
