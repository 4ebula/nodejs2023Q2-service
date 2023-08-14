import { Injectable } from '@nestjs/common';
import { Album, Artist, Favorites, Track } from '@prisma/client';
import { DbService } from 'src/db';
import { NotFoundError } from 'src/shared/models';

@Injectable()
export class FavService {
  private favId: string;

  constructor(private db: DbService) {}

  async onModuleInit() {
    await this.setFavId();
  }

  async getFavs(): Promise<Favorites> {
    return await this.db.favorites.findFirst({
      include: {
        artists: true,
        albums: true,
        tracks: true,
      },
    });
  }

  async addTrack(trackId: string): Promise<Track> {
    try {
      return await this.db.track.update({
        where: { id: trackId },
        data: { favoritedId: this.favId },
      });
    } catch {
      throw new NotFoundError();
    }
  }

  async addAlbum(albumId: string): Promise<Album> {
    try {
      return await this.db.album.update({
        where: { id: albumId },
        data: { favoritedId: this.favId },
      });
    } catch {
      throw new NotFoundError();
    }
  }

  async addArtist(artistId: string): Promise<Artist> {
    try {
      return await this.db.artist.update({
        where: { id: artistId },
        data: { favoritedId: this.favId },
      });
    } catch {
      throw new NotFoundError();
    }
  }

  async deleteTrack(trackId: string): Promise<Track> {
    try {
      return await this.db.track.update({
        where: { id: trackId, favoritedId: this.favId },
        data: { favoritedId: null },
      });
    } catch {
      throw new NotFoundError();
    }
  }

  async deleteAlbum(albumId: string): Promise<Album> {
    try {
      return await this.db.album.update({
        where: { id: albumId, favoritedId: this.favId },
        data: { favoritedId: null },
      });
    } catch {
      throw new NotFoundError();
    }
  }

  async deleteArtist(artistId: string): Promise<Artist> {
    try {
      return await this.db.artist.update({
        where: { id: artistId, favoritedId: this.favId },
        data: { favoritedId: null },
      });
    } catch {
      throw new NotFoundError();
    }
  }

  private async setFavId(): Promise<void> {
    let fav = await this.db.favorites.findFirst();

    if (!fav) {
      fav = await this.db.favorites.create({
        data: {
          artists: { create: [] },
          albums: { create: [] },
          tracks: { create: [] },
        },
      });
    }

    if (!this.favId) {
      this.favId = fav.id;
    }
  }
}
