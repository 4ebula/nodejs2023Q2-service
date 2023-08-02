import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { load as yamlLoad } from 'js-yaml';
import { readFile } from 'fs/promises';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const file = await readFile('doc/api.yaml', 'utf-8');
  const doc = yamlLoad(file);
  SwaggerModule.setup('doc', app, doc);

  await app.listen(parseInt(process.env.PORT, 10) || 4000);
}
bootstrap();
