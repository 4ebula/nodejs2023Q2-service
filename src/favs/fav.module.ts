import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { FavController } from './fav.controller';
import { FavService } from './fav.service';

@Module({
  imports: [DbModule],
  controllers: [FavController],
  providers: [FavService],
})
export class FavModule {}
