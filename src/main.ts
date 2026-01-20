import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppLoggerService } from './infra/commons/logger';
import { ResponseInterceptor } from './infra/commons/interceptors';
import { HttpExceptionFilter } from './infra/commons/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(AppLoggerService);
  app.useLogger(logger);

  // Global interceptor for standardized responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global exception filter for standardized errors
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Thera Consulting API')
    .setDescription(
      'API para gerenciamento de usuários, empresas, produtos e pedidos',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Autenticação e registro de usuários')
    .addTag('Users', 'Gerenciamento de usuários')
    .addTag('Companies', 'Gerenciamento de empresas')
    .addTag('Addresses', 'Gerenciamento de endereços')
    .addTag('Products', 'Gerenciamento de produtos')
    .addTag('Orders', 'Gerenciamento de pedidos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(
    `🚀 Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
  logger.log(
    `📚 Swagger docs available at: http://localhost:${port}/api/docs`,
    'Bootstrap',
  );
}

void bootstrap();
