import { Injectable } from '@nestjs/common';
import { Track } from '@prisma/client';
import { DbService } from 'src/db';
import { NotFoundError } from 'src/shared/models';
import { CreateTrackDto, UpdateTrackdDto } from './models';

@Injectable()
export class TrackService {
  constructor(private db: DbService) {}

  async getTracks(): Promise<Track[]> {
    return await this.db.track.findMany();
  }

  async getTrack(id: string): Promise<Track> {
    try {
      return await this.db.track.findUniqueOrThrow({ where: { id } });
    } catch {
      throw new NotFoundError();
    }
  }

  async createTrack(dto: CreateTrackDto): Promise<Track> {
    return await this.db.track.create({ data: dto });
  }

  async updateTrack(
    id: string,
    { name, duration, artistId, albumId }: UpdateTrackdDto,
  ): Promise<Track> {
    try {
      return await this.db.track.update({
        where: { id },
        data: { name, duration, artistId, albumId },
      });
    } catch {
      throw new NotFoundError();
    }
  }

  async deleteTrack(id: string): Promise<Track> {
    try {
      return await this.db.track.delete({ where: { id } });
    } catch {
      throw new NotFoundError();
    }
  }
}
