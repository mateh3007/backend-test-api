import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
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

  // Security headers
  app.use(helmet());

  // CORS configuration
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.enableCors({
    origin:
      corsOrigin === '*'
        ? true
        : corsOrigin.split(',').map((origin) => origin.trim()),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global interceptor for standardized responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global exception filter for standardized errors
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation (apenas em desenvolvimento)
  if (process.env.NODE_ENV !== 'production') {
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
      .addTag('Health', 'Health check e monitoramento')
      .addTag('Auth', 'Autenticação e registro de usuários')
      .addTag('Users', 'Gerenciamento de usuários')
      .addTag('Companies', 'Gerenciamento de empresas')
      .addTag('Addresses', 'Gerenciamento de endereços')
      .addTag('Products', 'Gerenciamento de produtos')
      .addTag('Orders', 'Gerenciamento de pedidos')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');

  logger.log(
    `🚀 Application is running on: http://0.0.0.0:${port}`,
    'Bootstrap',
  );
  
  if (process.env.NODE_ENV !== 'production') {
    logger.log(
      `📚 Swagger docs available at: http://localhost:${port}/api/docs`,
      'Bootstrap',
    );
  }
  
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`, 'Bootstrap');
}

void bootstrap();
