import { NestInterceptor, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class RemoveFavoritedInterceptor implements NestInterceptor {
  intercept(_: any, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (!value) {
          return;
        }

        if (Array.isArray(value)) {
          return value.map(({ favoritedId, ...rest }) => rest);
        }

        const { favoritedId, ...rest } = value;
        return rest;
      }),
    );
  }
}
