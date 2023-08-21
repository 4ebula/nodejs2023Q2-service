import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavModule } from './favs/fav.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { CustomExceptionsFilter } from './shared/services/exception-filter';
import { LoggerService } from './logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    LoggerModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionsFilter,
    },
  ],
})
export class AppModule {
  constructor(private logger: LoggerService) {
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error(
        `Unhandled Rejection at: ${promise}, reason: ${reason}`,
      );
    });

    process.on('uncaughtException', (error, origin) => {
      this.logger.error(`Caught exception: ${error}, Origin: ${origin}`);
    });
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
