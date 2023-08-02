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
  UpdatePasswordDto,
  Messages,
} from './models';
import { UserService } from './user.service';
import { IdParam } from 'src/shared/models';

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
  getUser(@Param() { id }: IdParam): UserBasic {
    const user = this.userService.getUser(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
    return user;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  createUser(@Body(new ValidationPipe()) dto: CreateUserDto): UserBasic {
    const user = this.userService.createUser(dto);
    if (!user) {
      throw new ConflictException(Messages.AlreadyExists);
    }

    return user;
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  changePassword(
    @Param() { id }: IdParam,
    @Body(new ValidationPipe()) dto: UpdatePasswordDto,
  ): UserBasic {
    const user = this.userService.changePassword(id, dto);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }

    return user;
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  delete(@Param() { id }: IdParam): void {
    const user = this.userService.deleteUser(id);
    if (!user) {
      throw new NotFoundException(Messages.NotFound);
    }
  }
}
