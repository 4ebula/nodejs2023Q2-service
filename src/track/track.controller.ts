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
import { TrackService } from './track.service';
import { Track } from 'src/db/track';
import { IdParam } from 'src/shared/models';
import { Messages } from './models/messages';
import { CreateTrackDto, UpdateTrackdDto } from './models';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  getTracks(): Track[] {
    return this.trackService.getTracks();
  }

  @Get(':id')
  getTrack(@Param() { id }: IdParam): Track {
    const user = this.trackService.getTrack(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
    return user;
  }

  @Post()
  createTrack(@Body(new ValidationPipe()) dto: CreateTrackDto): Track {
    return this.trackService.createTrack(dto);
  }

  @Put(':id')
  updateTrack(
    @Param() { id }: IdParam,
    @Body(new ValidationPipe()) dto: UpdateTrackdDto,
  ): Track {
    const user = this.trackService.updateTrack(id, dto);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }

    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param() { id }: IdParam): void {
    const user = this.trackService.deleteTrack(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
  }
}
