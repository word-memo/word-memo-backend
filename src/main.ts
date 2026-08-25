import { AppModule } from '@/app.module';
import { swaggerBasicAuthMiddleware } from '@/common/middleware/swagger-basic-auth.middleware';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const GLOBAL_API_PREFIX = 'api';
const DEFAULT_PORT = 3000;

const SWAGGER_API_PATH = 'docs';
const DEFAULT_API_VERSION = '1.0.0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GLOBAL_API_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const swaggerUser = configService.getOrThrow<string>('SWAGGER_USER');
  const swaggerPassword = configService.getOrThrow<string>('SWAGGER_PASSWORD');

  app.use(
    [
      `/${SWAGGER_API_PATH}`,
      `/${SWAGGER_API_PATH}-json`,
      `/${SWAGGER_API_PATH}-yaml`,
    ],
    swaggerBasicAuthMiddleware(swaggerUser, swaggerPassword),
  );

  const config = new DocumentBuilder()
    .setTitle('Word Memo API Documentation')
    .setVersion(DEFAULT_API_VERSION)
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_API_PATH, app, documentFactory);

  const port = configService.get<number>('PORT');

  await app.listen(port ?? DEFAULT_PORT);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
