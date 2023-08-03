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
import { Artist } from '@prisma/client';
import { IdParam } from 'src/shared/models';
import { RemoveFavoritedInterceptor } from 'src/shared/interceptors';
import { ErrorService } from 'src/shared/services';
import { ArtistService } from './artist.service';
import { CreateArtistDto, UpdateArtistdDto } from './models';

@Controller('artist')
@UseInterceptors(new RemoveFavoritedInterceptor())
export class ArtistController extends ErrorService {
  constructor(private artistService: ArtistService) {
    super();
  }

  @Get()
  async getArtists(): Promise<Artist[]> {
    return await this.artistService.getArtists();
  }

  @Get(':id')
  async getArtist(@Param() { id }: IdParam): Promise<Artist> {
    try {
      const user = await this.artistService.getArtist(id);

      return user;
    } catch (err) {
      this.throwExceptions('Artist', err);
    }
  }

  @Post()
  async createArtist(
    @Body(new ValidationPipe()) dto: CreateArtistDto,
  ): Promise<Artist> {
    return await this.artistService.createArtist(dto);
  }

  @Put(':id')
  async updateArtist(
    @Param() { id }: IdParam,
    @Body(new ValidationPipe()) dto: UpdateArtistdDto,
  ): Promise<Artist> {
    try {
      const user = await this.artistService.updateArtist(id, dto);

      return user;
    } catch (err) {
      this.throwExceptions('Artist', err);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() { id }: IdParam): Promise<void> {
    try {
      await this.artistService.deleteArtist(id);
    } catch (err) {
      this.throwExceptions('Artist', err);
    }
  }
}
