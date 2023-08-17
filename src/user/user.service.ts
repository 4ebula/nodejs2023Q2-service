import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db';
import { ForbiddenError, NotFoundError } from 'src/shared/models';
import { CreateUserDto, UpdatePasswordDto, User } from './models';
import { UserSharedService } from 'src/shared/services';

@Injectable()
export class UserService extends UserSharedService {
  constructor(private readonly db: DbService) {
    super(db);
  }

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
      const user = await this.addUser(dto);
      return user ? new User(user) : null;
    } catch (err) {
      throw err;
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
}
