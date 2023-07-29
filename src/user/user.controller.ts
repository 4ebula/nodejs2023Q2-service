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
} from '@nestjs/common';
import {
  UserBasic,
  CreateUserDto,
  UserParam,
  UpdatePasswordDto,
} from './models';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getUsers(): UserBasic[] {
    return this.userService.getUsers();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  getUser(@Param() { id }: UserParam): UserBasic {
    const user = this.userService.getUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  createUser(@Body(new ValidationPipe()) dto: CreateUserDto): UserBasic {
    const user = this.userService.createUser(dto);
    if (!user) {
      throw new ConflictException('User already exists');
    }

    return user;
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  changePassword(
    @Param() { id }: UserParam,
    @Body(new ValidationPipe()) dto: UpdatePasswordDto,
  ): UserBasic {
    const user = this.userService.changePassword(id, dto);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  delete(@Param() { id }: UserParam): void {
    const user = this.userService.deleteUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
