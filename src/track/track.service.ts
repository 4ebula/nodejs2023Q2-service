import { Injectable } from '@nestjs/common';
import { Track } from 'src/db/track';
import { DB } from 'src/db/db';
import { CreateTrackDto, UpdateTrackdDto } from './models';

@Injectable()
export class TrackService {
  constructor(private db: DB) {}

  getTracks(): Track[] {
    return this.db.track.findMany();
  }

  getTrack(id: string): Track | null {
    return this.db.track.findUnique(id) ?? null;
  }

  createTrack(dto: CreateTrackDto): Track | null {
    return this.db.track.create({ data: dto });
  }

  updateTrack(
    id: string,
    { name, duration, artistId, albumId }: UpdateTrackdDto,
  ): Track | null {
    const track = this.db.track.findUnique(id);
    if (!track) {
      return null;
    }

    return this.db.track.update(id, {
      data: { name, duration, artistId, albumId },
    });
  }

  deleteTrack(id: string): Track | null {
    return this.db.track.delete(id);
  }
}
