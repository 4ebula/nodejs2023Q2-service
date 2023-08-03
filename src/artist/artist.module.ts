import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { DbModule } from 'src/db/db.module';
import { RemoveFavoritedInterceptor } from 'src/shared/interceptors';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, RemoveFavoritedInterceptor],
  imports: [DbModule],
})
export class ArtistModule {}
