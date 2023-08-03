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
import { Track } from '@prisma/client';
import { IdParam } from 'src/shared/models';
import { ErrorService } from 'src/shared/services';
import { RemoveFavoritedInterceptor } from 'src/shared/interceptors';
import { CreateTrackDto, UpdateTrackdDto } from './models';
import { TrackService } from './track.service';

@Controller('track')
@UseInterceptors(new RemoveFavoritedInterceptor())
export class TrackController extends ErrorService {
  constructor(private trackService: TrackService) {
    super();
  }

  @Get()
  async getTracks(): Promise<Track[]> {
    return await this.trackService.getTracks();
  }

  @Get(':id')
  async getTrack(@Param() { id }: IdParam): Promise<Track> {
    try {
      return await this.trackService.getTrack(id);
    } catch (err) {
      this.throwExceptions('Track', err);
    }
  }

  @Post()
  async createTrack(
    @Body(new ValidationPipe()) dto: CreateTrackDto,
  ): Promise<Track> {
    return await this.trackService.createTrack(dto);
  }

  @Put(':id')
  async updateTrack(
    @Param() { id }: IdParam,
    @Body(new ValidationPipe()) dto: UpdateTrackdDto,
  ): Promise<Track> {
    try {
      return await this.trackService.updateTrack(id, dto);
    } catch (err) {
      this.throwExceptions('Track', err);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() { id }: IdParam): Promise<void> {
    try {
      await this.trackService.deleteTrack(id);
    } catch (err) {
      this.throwExceptions('Track', err);
    }
  }
}
