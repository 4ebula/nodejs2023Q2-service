import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  ConflictError,
  ForbiddenError,
  InvalidCredentialsError,
  Messages,
  NotFoundError,
} from '../models';

export abstract class ErrorService {
  protected throwExceptions(prefix: string, err: Error): void {
    if (err instanceof NotFoundError) {
      throw new NotFoundException(`${prefix} ${Messages.NotFound}`);
    }

    if (err instanceof ConflictError) {
      throw new ConflictException(`${prefix} ${Messages.AlreadyExists}`);
    }

    if (err instanceof ForbiddenError) {
      throw new ForbiddenException(err.message);
    }

    if (err instanceof InvalidCredentialsError) {
      throw new ForbiddenException('User with such credentials does not exist');
    }
  }
}
