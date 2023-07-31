import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [DbModule],
})
export class AlbumModule {}
