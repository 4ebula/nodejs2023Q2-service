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
import { ArtistService } from './artist.service';
import { Artist } from 'src/db/artist';
import { IdParam } from 'src/shared/models';
import { Messages } from './models/messages';
import { CreateArtistDto, UpdateArtistdDto } from './models';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  getArtists(): Artist[] {
    return this.artistService.getArtists();
  }

  @Get(':id')
  getArtist(@Param() { id }: IdParam): Artist {
    const user = this.artistService.getArtist(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
    return user;
  }

  @Post()
  createArtist(@Body(new ValidationPipe()) dto: CreateArtistDto): Artist {
    return this.artistService.createArtist(dto);
  }

  @Put(':id')
  updateArtist(
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
  @HttpCode(204)
  delete(@Param() { id }: IdParam): void {
    const user = this.artistService.deleteArtist(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
  }
}
