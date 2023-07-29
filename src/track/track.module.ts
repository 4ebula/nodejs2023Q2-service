import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [DbModule],
})
export class TrackModule {}
