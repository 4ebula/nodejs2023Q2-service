import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  imports: [DbModule],
})
export class ArtistModule {}
