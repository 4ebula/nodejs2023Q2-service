import { Injectable } from '@nestjs/common';
import { Artist } from 'src/db/artist';
import { DB } from 'src/db/db';
import { CreateArtistDto, UpdateArtistdDto } from './models';

@Injectable()
export class ArtistService {
  constructor(private db: DB) {}

  getUsers(): Artist[] {
    return this.db.artist.findMany();
  }

  getUser(id: string): Artist | null {
    return this.db.artist.findUnique(id) ?? null;
  }

  createArtist(dto: CreateArtistDto): Artist | null {
    return this.db.artist.create({ data: dto });
  }

  updateArtist(id: string, { name, grammy }: UpdateArtistdDto): Artist | null {
    const artist = this.db.artist.findUnique(id);
    if (!artist) {
      return null;
    }

    return this.db.artist.update(id, { data: { name, grammy } });
  }

  deleteArtist(id: string): Artist | null {
    return this.db.artist.delete(id);
  }
}
