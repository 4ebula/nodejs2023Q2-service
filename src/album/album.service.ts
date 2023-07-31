import { Injectable } from '@nestjs/common';
import { Album } from 'src/db/album';
import { DB } from 'src/db/db';
import { CreateAlbumDto, UpdateAlbumdDto } from './models';

@Injectable()
export class AlbumService {
  constructor(private db: DB) {}

  getAlbums(): Album[] {
    return this.db.album.findMany();
  }

  getAlbum(id: string): Album | null {
    return this.db.album.findUnique(id) ?? null;
  }

  createAlbum(dto: CreateAlbumDto): Album | null {
    return this.db.album.create({ data: dto });
  }

  updateAlbum(
    id: string,
    { name, year, artistId }: UpdateAlbumdDto,
  ): Album | null {
    const album = this.db.album.findUnique(id);
    if (!album) {
      return null;
    }

    return this.db.album.update(id, { data: { name, year, artistId } });
  }

  deleteAlbum(id: string): Album | null {
    return this.db.album.delete(id);
  }
}
