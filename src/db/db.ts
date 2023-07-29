import { Injectable } from '@nestjs/common';
import { User } from './user';
import { CreateUserData, UserBasic } from 'src/user/models';
import { Artist } from './artist';
import { ArtistData } from 'src/artist/models';

@Injectable()
export class DB {
  private users: Map<string, User> = new Map();
  private artists: Map<string, Artist> = new Map();

  constructor() {
    const artist = new Artist('Slayer', true);
    this.artists.set(artist.id, artist);
  }

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
        return artist;
      },
    };
  }

  private checkUserExistence(login: string): boolean {
    return [...this.users.values()].some((user) => user.login === login);
  }
}
