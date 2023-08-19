import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/db';
import { ConflictError, InvalidCredentialsError } from 'src/shared/models';
import { UserSharedService } from 'src/shared/services';
import { CreateUserDto } from 'src/user/models';
import { LoginResponse } from './models';

@Injectable()
export class AuthService extends UserSharedService {
  constructor(private db: DbService, private jwtService: JwtService) {
    super(db);
  }

  async createUser(dto: CreateUserDto): Promise<string> {
    try {
      const hashedPass = await this.hashPassword(dto.password);
      const user = await this.db.user.create({
        data: { ...dto, password: hashedPass, version: 1 },
      });
      return user.id;
    } catch {
      throw new ConflictError();
    }
  }

  async login({ login, password }: CreateUserDto): Promise<LoginResponse> {
    const user = await this.db.user.findUnique({ where: { login } });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPassMatch = await this.checkPasswordMatch(user.password, password);
    if (!isPassMatch) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      login: user.login,
    });

    return { accessToken };
  }
}
