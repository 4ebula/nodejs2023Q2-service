import { Injectable } from '@nestjs/common';
import { Artist } from './artist';
import { Album } from './album';
import { Track } from './track';
import { Fav, FavKeys } from './fav';

@Injectable()
export class DB {
  private favs: Fav = { artists: [], albums: [], tracks: [] };

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
