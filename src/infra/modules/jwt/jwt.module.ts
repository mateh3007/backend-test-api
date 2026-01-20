import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtAdapter } from '../../../domain/adapters';
import { JwtIntegration } from '../../integrations';

@Global()
@Module({
  imports: [
    NestJwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      signOptions: { expiresIn: Number(process.env.JWT_EXPIRES_IN) || 1 },
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
