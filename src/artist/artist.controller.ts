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
import { ArtistService } from './artist.service';
import { Artist } from 'src/db/artist';
import { IdParam } from 'src/shared/models/shared.model';
import { Messages } from './models/messages';
import { CreateArtistDto, UpdateArtistdDto } from './models';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getUsers(): Artist[] {
    return this.artistService.getUsers();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  getUser(@Param() { id }: IdParam): Artist {
    const user = this.artistService.getUser(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
    return user;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  createUser(@Body(new ValidationPipe()) dto: CreateArtistDto): Artist {
    return this.artistService.createArtist(dto);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  changePassword(
    @Param() { id }: IdParam,
    @Body(new ValidationPipe()) dto: UpdateArtistdDto,
  ): Artist {
    const user = this.artistService.updateArtist(id, dto);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }

    return user;
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  delete(@Param() { id }: IdParam): void {
    const user = this.artistService.deleteArtist(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
  }
}
