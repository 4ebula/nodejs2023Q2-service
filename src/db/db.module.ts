import { Global, Module } from '@nestjs/common';
import { DB } from './db';
import { DbService } from './db.service';

@Global()
@Module({
  providers: [DB, DbService],
  exports: [DB, DbService],
})
export class DbModule {}
