import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  ConflictException,
  NotFoundException,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  IdParam,
  Messages,
} from 'src/shared/models';
import { UserResponce, CreateUserDto, UpdatePasswordDto } from './models';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getUsers(): Promise<UserResponce[]> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUser(@Param() { id }: IdParam): Promise<UserResponce> {
    const user = await this.userService.getUser(id);
    if (!user) {
      throw new NotFoundException(`User ${Messages.NotFound}`);
    }
    return user;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async createUser(
    @Body(new ValidationPipe()) dto: CreateUserDto,
  ): Promise<UserResponce> {
    try {
      const user = await this.userService.createUser(dto);

      return user;
    } catch (err) {
      if (err instanceof ConflictError) {
        throw new ConflictException(`User ${Messages.AlreadyExists}`);
      }
    }
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async changePassword(
    @Param() { id }: IdParam,
    @Body(new ValidationPipe()) dto: UpdatePasswordDto,
  ): Promise<UserResponce> {
    try {
      return await this.userService.changePassword(id, dto);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException(`User ${Messages.NotFound}`);
      }

      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  async delete(@Param() { id }: IdParam): Promise<void> {
    try {
      await this.userService.deleteUser(id);
    } catch {
      throw new NotFoundException(`User ${Messages.NotFound}`);
    }
  }
}
