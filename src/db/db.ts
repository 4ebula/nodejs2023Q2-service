import { Injectable } from '@nestjs/common';
import { User } from './user';
import { CreateUserData, UserBasic } from 'src/user/models';

@Injectable()
export class DB {
  private users: Map<string, User> = new Map();

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

  private checkUserExistence(login: string): boolean {
    return [...this.users.values()].some((user) => user.login === login);
  }
}
