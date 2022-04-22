import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX);
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
