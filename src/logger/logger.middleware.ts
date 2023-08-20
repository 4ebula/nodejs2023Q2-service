import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: LoggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl: url, method, query, body } = req;

    res.on('close', () => {
      const { statusCode } = res;
      this.logger.log({ url, method, query, body, code: statusCode });
    });

    next();
  }
}
