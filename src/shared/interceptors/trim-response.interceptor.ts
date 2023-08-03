import { NestInterceptor, CallHandler } from '@nestjs/common';
import { Album, Artist, Track } from '@prisma/client';
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

export class RemoveFavIdInterceptor implements NestInterceptor {
  intercept(_: any, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((item) => {
        if (!item) {
          return;
        }

        const { artists, albums, tracks } = item;

        return {
          artists: artists.map(this.removeFavoredId),
          albums: albums.map(this.removeFavoredId),
          tracks: tracks.map(this.removeFavoredId),
        };
      }),
    );
  }

  private removeFavoredId<T extends Artist | Album | Track>(
    item: T,
  ): Omit<T, 'favoritedId'> {
    const { favoritedId, ...rest } = item;
    return rest;
  }
}
