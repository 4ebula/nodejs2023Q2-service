import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthorizationError,
  ConflictError,
  ForbiddenError,
  InvalidCredentialsError,
  Messages,
  NotFoundError,
} from '../models';

export abstract class ErrorService {
  protected throwExceptions(prefix: string, err: Error): void {
    switch (true) {
      case err instanceof NotFoundError:
        throw new NotFoundException(`${prefix} ${Messages.NotFound}`);
      case err instanceof ConflictError:
        throw new ConflictException(`${prefix} ${Messages.AlreadyExists}`);
      case err instanceof ForbiddenError:
        throw new ForbiddenException(err.message);
      case err instanceof InvalidCredentialsError:
        throw new ForbiddenException(
          'User with such credentials does not exist',
        );
      case err instanceof AuthorizationError:
        throw new UnauthorizedException(err.message || '');
      default:
        throw new InternalServerErrorException();
    }
  }
}
