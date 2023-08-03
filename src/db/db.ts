import { Injectable } from '@nestjs/common';
import { Artist } from './artist';
import { Album } from './album';
import { AlbumData } from 'src/album/models';
import { Track } from './track';
import { TrackData } from 'src/track/models';
import { Fav, FavKeys } from './fav';

@Injectable()
export class DB {
  private albums: Map<string, Album> = new Map();
  private tracks: Map<string, Track> = new Map();
  private favs: Fav = { artists: [], albums: [], tracks: [] };

  get album() {
    return {
      findMany: (): Album[] => [...this.albums.values()],
      findUnique: (id: string): Album | undefined => this.albums.get(id),
      create: ({ data: { name, year, artistId } }: AlbumData): Album | null => {
        const album = new Album(name, year, artistId);
        this.albums.set(album.id, album);
        return album;
      },
      update: (
        id: string,
        { data: { name, year, artistId } }: AlbumData,
      ): Album | null => {
        const album = this.albums.get(id);
        return album.update(name, year, artistId);
      },
      delete: (id: string): Album | null => {
        const album = this.albums.get(id);
        if (!album) {
          return null;
        }

        this.albums.delete(id);
        [...this.tracks.values()]
          .filter((track) => track.albumId === id)
          .forEach((track) => track.updateAlbum(null));

        this.fav.delete(FavKeys.Album, id);

        return album;
      },
    };
  }

  get track() {
    return {
      findMany: (): Track[] => [...this.tracks.values()],
      findUnique: (id: string): Track | undefined => this.tracks.get(id),
      create: ({
        data: { name, duration, artistId, albumId },
      }: TrackData): Track | null => {
        const track = new Track(name, duration, artistId, albumId);
        this.tracks.set(track.id, track);
        return track;
      },
      update: (
        id: string,
        { data: { name, duration, artistId, albumId } }: TrackData,
      ): Track | null => {
        const track = this.tracks.get(id);
        return track.update(name, duration, artistId, albumId);
      },
      delete: (id: string): Track | null => {
        const track = this.tracks.get(id);
        if (!track) {
          return null;
        }

        this.tracks.delete(id);
        this.fav.delete(FavKeys.Track, id);

        return track;
      },
    };
  }

  get fav() {
    return {
      findMany: (): Fav => this.favs,
      findUnique: (key: FavKeys, id: string) => {
        const index = this.favs[key].findIndex(
          (el: Artist | Album | Track) => el.id === id,
        );
        if (index !== -1) {
          return this.favs[key][index];
        }
      },
      create: (key: FavKeys, payload: Track | Album | Artist): void => {
        switch (key) {
          case FavKeys.Track:
            this.favs.tracks.push(payload as Track);
            break;
          case FavKeys.Album:
            this.favs.albums.push(payload as Album);
            break;
          case FavKeys.Artist:
            this.favs.artists.push(payload as Artist);
            break;
          default:
            break;
        }
      },
      delete: (key: FavKeys, id: string): Artist | Album | Track => {
        const index = this.favs[key].findIndex(
          (el: Artist | Album | Track) => el.id === id,
        );
        if (index !== -1) {
          const item = this.favs[key][index];
          this.favs[key].splice(index, 1);
          return item;
        }
      },
    };
  }
}
