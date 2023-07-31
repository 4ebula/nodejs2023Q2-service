import { Injectable, ForbiddenException } from '@nestjs/common';
import { DB } from 'src/db/db';
import { CreateUserDto, UpdatePasswordDto, UserBasic } from './models';

@Injectable()
export class UserService {
  constructor(private db: DB) {}

  getUsers(): UserBasic[] {
    return this.db.user.findMany();
  }

  getUser(id: string): UserBasic | null {
    return this.db.user.findUnique(id) ?? null;
  }

  createUser(dto: CreateUserDto): UserBasic | null {
    return this.db.user.create({ data: dto });
  }

  changePassword(
    id: string,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ): UserBasic | null {
    const user = this.db.user.findUnique(id);
    if (!user) {
      return null;
    }

    if (!user.checkPasswordValidity(oldPassword)) {
      throw new ForbiddenException('Wrong password');
    }

    return this.db.user.update(id, { newPassword });
  }

  deleteUser(id: string): UserBasic | null {
    return this.db.user.delete(id);
  }
}
