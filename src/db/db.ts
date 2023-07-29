import { Injectable } from '@nestjs/common';
import { User } from './user';
import { CreateUserData, UserBasic } from 'src/user/models';
import { Artist } from './artist';
import { ArtistData } from 'src/artist/models';
import { Album } from './album';
import { AlbumData } from 'src/album/models';
import { Track } from './track';
import { TrackData } from 'src/track/models';

@Injectable()
export class DB {
  private users: Map<string, User> = new Map();
  private artists: Map<string, Artist> = new Map();
  private albums: Map<string, Album> = new Map();
  private tracks: Map<string, Track> = new Map();

  get user() {
    return {
      findMany: (): UserBasic[] => [...this.users.values()],
      findUnique: (id: string): User | undefined => this.users.get(id),
      create: ({
        data: { login, password },
      }: CreateUserData): UserBasic | null => {
        if (this.checkUserExistence(login)) {
          return null;
        }

        const user = new User(login, password);
        this.users.set(user.id, user);
        return user;
      },
      update: (
        id: string,
        { newPassword }: { newPassword: string },
      ): UserBasic | null => {
        const user = this.users.get(id);
        return user.updatePassword(newPassword);
      },
      delete: (id: string): UserBasic | null => {
        const user = this.users.get(id);
        if (!user) {
          return null;
        }

        this.users.delete(id);
        return user;
      },
    };
  }

  get artist() {
    return {
      findMany: (): Artist[] => [...this.artists.values()],
      findUnique: (id: string): Artist | undefined => this.artists.get(id),
      create: ({ data: { name, grammy } }: ArtistData): Artist | null => {
        const artist = new Artist(name, grammy);
        this.artists.set(artist.id, artist);
        return artist;
      },
      update: (
        id: string,
        { data: { name, grammy } }: ArtistData,
      ): Artist | null => {
        const artist = this.artists.get(id);
        return artist.update(name, grammy);
      },
      delete: (id: string): Artist | null => {
        const artist = this.artists.get(id);
        if (!artist) {
          return null;
        }

        this.artists.delete(id);
        [...this.albums.values()]
          .filter((album) => album.artistId === id)
          .forEach((album) => album.updateArtist(null));

        [...this.tracks.values()]
          .filter((track) => track.artistId === id)
          .forEach((track) => track.updateArtist(null));

        return artist;
      },
    };
  }

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
        return track;
      },
    };
  }

  private checkUserExistence(login: string): boolean {
    return [...this.users.values()].some((user) => user.login === login);
  }
}
