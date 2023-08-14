import { Injectable } from '@nestjs/common';
import { Album } from '@prisma/client';
import { DbService } from 'src/db';
import { CreateAlbumDto, UpdateAlbumdDto } from './models';
import { NotFoundError } from 'src/shared/models';

@Injectable()
export class AlbumService {
  constructor(private db: DbService) {}

  async getAlbums(): Promise<Album[]> {
    return await this.db.album.findMany();
  }

  async getAlbum(id: string): Promise<Album> {
    try {
      return await this.db.album.findUniqueOrThrow({ where: { id } });
    } catch {
      throw new NotFoundError();
    }
  }

  async createAlbum(dto: CreateAlbumDto): Promise<Album> {
    return await this.db.album.create({ data: dto });
  }

  async updateAlbum(
    id: string,
    { name, year, artistId }: UpdateAlbumdDto,
  ): Promise<Album> {
    try {
      return await this.db.album.update({
        where: { id },
        data: { name, year, artistId },
      });
    } catch {
      throw new NotFoundError();
    }
  }

  async deleteAlbum(id: string): Promise<Album> {
    try {
      return await this.db.album.delete({ where: { id } });
    } catch {
      throw new NotFoundError();
    }
  }
}
