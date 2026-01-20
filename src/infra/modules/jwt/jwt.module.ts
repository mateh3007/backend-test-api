import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtAdapter } from '../../../domain/adapters';
import { JwtIntegration } from '../../integrations';
import type { StringValue } from 'ms';

@Global()
@Module({
  imports: [
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          'your-super-secret-jwt-key',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ||
            '1d') as StringValue,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: JwtAdapter,
      useClass: JwtIntegration,
    },
  ],
  exports: [JwtAdapter, NestJwtModule],
})
export class JwtModule {}
