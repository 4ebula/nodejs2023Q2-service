import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';

@Catch()
@Injectable()
export class CustomExceptionsFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    let payload;
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        payload = {
          status: exception.getStatus(),
          message: res,
        };
      } else {
        payload = {
          status: exception.getStatus(),
          message: (res as Record<string, any>).message,
          error: (res as Record<string, any>).error,
        };
      }
    } else {
      payload = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }

    this.logger.error(JSON.stringify(payload));

    response.status(payload.status).json(payload);
  }
}
