import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db';
import { CreateArtistDto, UpdateArtistdDto } from './models';
import { Artist } from '@prisma/client';
import { NotFoundError } from 'src/shared/models';

@Injectable()
export class ArtistService {
  constructor(private db: DbService) {}

  async getArtists(): Promise<Artist[]> {
    return await this.db.artist.findMany();
  }

  async getArtist(id: string): Promise<Artist> {
    const artist = await this.db.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new NotFoundError();
    }

    return artist;
  }

  async createArtist(dto: CreateArtistDto): Promise<Artist> {
    return await this.db.artist.create({ data: dto });
  }

  async updateArtist(
    id: string,
    { name, grammy }: UpdateArtistdDto,
  ): Promise<Artist> {
    const artist = await this.db.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new NotFoundError();
    }

    return await this.db.artist.update({
      where: { id },
      data: { name, grammy },
    });
  }

  async deleteArtist(id: string): Promise<void> {
    try {
      await this.db.artist.delete({ where: { id } });
    } catch {
      throw new NotFoundError();
    }
  }
}
