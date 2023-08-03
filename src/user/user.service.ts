import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { DbService } from 'src/db';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from 'src/shared/models';
import { CreateUserDto, UpdatePasswordDto, User } from './models';
import { SALT_ROUNDS } from './config';

@Injectable()
export class UserService {
  constructor(private readonly db: DbService) {}

  async getUsers(): Promise<User[]> {
    const users = await this.db.user.findMany();
    return users.map((user) => new User(user));
  }

  async getUser(id: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: { id },
    });
    return user ? new User(user) : null;
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      const hashedPass = await this.hashPassword(dto.password);
      const user = await this.db.user.create({
        data: { ...dto, password: hashedPass, version: 1 },
      });
      return user ? new User(user) : null;
    } catch {
      throw new ConflictError();
    }
  }

  async changePassword(
    id: string,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ): Promise<User> {
    const foundUser = await this.db.user.findUnique({
      where: { id },
      select: { password: true, version: true },
    });

    if (!foundUser) {
      throw new NotFoundError();
    }

    const { password, version } = foundUser;

    const isPasswordsMatch = await this.checkPasswordMatch(
      password,
      oldPassword,
    );

    if (!isPasswordsMatch) {
      throw new ForbiddenError('Wrong password');
    }
    const hashedPassword = await this.hashPassword(newPassword);
    const user = await this.db.user.update({
      where: { id },
      data: { password: hashedPassword, version: version + 1 },
    });

    return new User(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.db.user.delete({ where: { id } });
    if (!user) {
      throw new NotFoundError();
    }
  }

  private async checkPasswordMatch(
    savedPassword: string,
    inputPassword: string,
  ): Promise<boolean> {
    return await compare(inputPassword, savedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, SALT_ROUNDS);
  }
}
