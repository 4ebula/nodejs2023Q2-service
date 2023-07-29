import { Exclude } from 'class-transformer';
import { randomUUID } from 'crypto';

export class User {
  id: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  @Exclude()
  private password: string;

  constructor(public login: string, password: string) {
    this.id = randomUUID();
    this.version = 1;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.password = password;
  }

  updatePassword(password: string): User {
    this.password = password;
    this.version++;
    this.updatedAt = Date.now();
    return this;
  }

  checkPasswordValidity(password: string): boolean {
    return this.password === password;
  }
}
