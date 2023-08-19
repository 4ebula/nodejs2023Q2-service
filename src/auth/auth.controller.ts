import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ErrorService } from 'src/shared/services';
import { CreateUserDto } from 'src/user/models';
import { AuthService } from './auth.service';
import { LoginResponse, RefreshDto } from './models';
import { SkipAuth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController extends ErrorService {
  constructor(private authService: AuthService) {
    super();
  }

  @Post('signup')
  @SkipAuth()
  async createUser(@Body() dto: CreateUserDto): Promise<{ id: string }> {
    try {
      const id = await this.authService.createUser(dto);
      return { id };
    } catch (err) {
      this.throwExceptions('User', err);
    }
  }

  @Post('login')
  @SkipAuth()
  @HttpCode(200)
  async login(@Body() dto: CreateUserDto): Promise<LoginResponse> {
    try {
      return await this.authService.login(dto);
    } catch (err) {
      this.throwExceptions('User', err);
    }
  }

  @Post('refresh')
  @SkipAuth()
  async refresh(@Body() dto: RefreshDto): Promise<LoginResponse> {
    try {
      return await this.authService.refresh(dto);
    } catch (err) {
      this.throwExceptions('User', err);
    }
  }
}
