import { Module } from '@nestjs/common';
import { FavController } from './fav.controller';
import { FavService } from './fav.service';

@Module({
  controllers: [FavController],
  providers: [FavService],
})
export class FavModule {}
