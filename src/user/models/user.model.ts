import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export class User {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  @Exclude()
  password: string;

  constructor(user: UserFromDb) {
    const { id, login, version, password, createdAt, updatedAt } = user;
    this.id = id;
    this.login = login;
    this.version = version;
    this.password = password;
    this.createdAt = new Date(createdAt).getTime();
    this.updatedAt = new Date(updatedAt).getTime();
  }
}

interface UserBasic {
  id: string;
  login: string;
  version: number;
}

export interface UserResponce extends UserBasic {
  createdAt: number;
  updatedAt: number;
}

export interface UserFromDb extends UserBasic {
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
