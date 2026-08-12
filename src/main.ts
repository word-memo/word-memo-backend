import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const DEFAULT_PORT = 3000;
const SWAGGER_API_PATH = 'docs';
const DEFAULT_API_VERSION = '1.0.0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Word Memo API Documentation')
    .setVersion(DEFAULT_API_VERSION)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_API_PATH, app, documentFactory);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app.listen(port ?? DEFAULT_PORT);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
