import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.get<boolean>(
      'skipAuth',
      context.getHandler(),
    );
    if (skipAuth) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    try {
      const token = this.extractAuthToken(request);
      console.log(token);
      const tokenData = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      console.log(tokenData);
    } catch (err) {
      throw new UnauthorizedException(err.message || '');
    }

    return true;
  }

  private extractAuthToken(request: Request): string {
    const { authorization } = request.headers;
    if (!authorization) {
      throw new Error('Authorization header is not provided');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
      throw new Error('Wrong type of token');
    }

    return token;
  }
}
