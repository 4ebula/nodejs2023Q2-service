import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: LoggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const { originalUrl: url, method, query, body } = req;

      res.on('close', () => {
        const { statusCode } = res;
        const message = `${url}\t${method}\t${JSON.stringify(
          query,
        )}\t${JSON.stringify(body)}\t${statusCode}`;
        this.logger.logRequest(message);
      });
    } catch (err) {
      this.logger.error(err);
    }

    next();
  }
}
