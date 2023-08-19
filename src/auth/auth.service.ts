import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/db';
import {
  AuthorizationError,
  ConflictError,
  InvalidCredentialsError,
  NotFoundError,
} from 'src/shared/models';
import { UserSharedService } from 'src/shared/services';
import { CreateUserDto } from 'src/user/models';
import { LoginResponse, RefreshDto } from './models';

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

    const { id, login: userLogin } = user;
    return await this.createTokens(id, userLogin);
  }

  async refresh({ refreshToken }: RefreshDto): Promise<LoginResponse> {
    try {
      const refreshData = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const { sub: id, login } = refreshData;

      const user = await this.db.user.findUnique({ where: { id } });

      if (user) {
        return await this.createTokens(id, login);
      } else {
        throw new NotFoundError();
      }
    } catch (err) {
      throw new AuthorizationError(err.message);
    }
  }

  private async createTokens(
    id: string,
    login: string,
  ): Promise<LoginResponse> {
    const accessToken = await this.jwtService.signAsync({
      sub: id,
      login: login,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: id,
        login: login,
      },
      {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      },
    );

    return { accessToken, refreshToken };
  }
}
