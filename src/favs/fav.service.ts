import { Injectable } from '@nestjs/common';
import { Album } from 'src/db/album';
import { Artist } from 'src/db/artist';
import { DB } from 'src/db/db';
import { Fav, FavKeys } from 'src/db/fav';
import { Track } from 'src/db/track';

@Injectable()
export class FavService {
  constructor(private db: DB) {}

  getFavs(): Fav {
    return this.db.fav.findMany();
  }

  addTrack(id: string) {
    const track = this.db.track.findUnique(id);

    if (!track) {
      return null;
    }

    this.db.fav.create(FavKeys.Track, track);

    return track;
  }

  addAlbum(id: string) {
    const album = this.db.album.findUnique(id);

    if (!album) {
      return null;
    }

    this.db.fav.create(FavKeys.Album, album);

    return album;
  }

  addArtist(id: string) {
    const artist = this.db.artist.findUnique(id);

    if (!artist) {
      return null;
    }

    this.db.fav.create(FavKeys.Artist, artist);

    return artist;
  }

  deleteTrack(id: string): Track | null {
    const track = this.db.fav.findUnique(FavKeys.Track, id);
    console.log(track);
    if (!track) {
      return null;
    }

    return this.db.fav.delete(FavKeys.Track, id) as Track;
  }

  deleteAlbum(id: string): Album | null {
    const album = this.db.fav.findUnique(FavKeys.Album, id);

    if (!album) {
      return null;
    }

    return this.db.fav.delete(FavKeys.Album, id) as Album;
  }

  deleteArtist(id: string): Artist | null {
    const artist = this.db.fav.findUnique(FavKeys.Artist, id);

    if (!artist) {
      return null;
    }

    return this.db.fav.delete(FavKeys.Artist, id) as Artist;
  }
}
