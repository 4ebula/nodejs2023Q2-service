import { compare, hash } from 'bcrypt';
import { DbService } from 'src/db';
import { ConflictError } from '../models';
import { CreateUserDto } from 'src/user/models';
import { User } from '@prisma/client';
import { SALT_ROUNDS } from '../config';

export class UserSharedService {
  constructor(private readonly databaseService: DbService) {}

  async addUser(dto: CreateUserDto): Promise<User> {
    try {
      const hashedPass = await this.hashPassword(dto.password);
      const user = await this.databaseService.user.create({
        data: { ...dto, password: hashedPass, version: 1 },
      });
      return user ?? null;
    } catch {
      throw new ConflictError();
    }
  }

  protected async checkPasswordMatch(
    savedPassword: string,
    inputPassword: string,
  ): Promise<boolean> {
    return await compare(inputPassword, savedPassword);
  }

  protected async hashPassword(password: string): Promise<string> {
    const cryptSalt = +process.env.CRYPT_SALT;
    const salt = Number.isNaN(cryptSalt) ? SALT_ROUNDS : cryptSalt;
    return await hash(password, salt);
  }
}
