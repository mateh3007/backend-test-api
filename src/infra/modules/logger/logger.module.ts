import { Global, Module } from '@nestjs/common';
import { AppLoggerService } from '../../commons/logger';

@Global()
@Module({
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}

