import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

@Injectable()
export class AppLoggerService implements LoggerService {
  private context?: string;
  private readonly logLevels: LogLevel[] = [
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
  ];

  setContext(context: string) {
    this.context = context;
  }

  private formatMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context || 'Application';
    return `[${timestamp}] [${level.toUpperCase()}] [${ctx}] ${message}`;
  }

  log(message: string, context?: string) {
    console.log(
      '\x1b[32m%s\x1b[0m',
      this.formatMessage('LOG', message, context),
    );
  }

  error(message: string, trace?: string, context?: string) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      this.formatMessage('ERROR', message, context),
    );
    if (trace) {
      console.error('\x1b[31m%s\x1b[0m', trace);
    }
  }

  warn(message: string, context?: string) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      this.formatMessage('WARN', message, context),
    );
  }

  debug(message: string, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(
        '\x1b[36m%s\x1b[0m',
        this.formatMessage('DEBUG', message, context),
      );
    }
  }

  verbose(message: string, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        '\x1b[35m%s\x1b[0m',
        this.formatMessage('VERBOSE', message, context),
      );
    }
  }

  setLogLevels(levels: LogLevel[]) {
    // Implementação para configurar níveis de log
  }

  logRequest(method: string, url: string, statusCode: number, duration: number) {
    const statusColor =
      statusCode >= 500
        ? '\x1b[31m'
        : statusCode >= 400
          ? '\x1b[33m'
          : '\x1b[32m';
    console.log(
      `${statusColor}[${new Date().toISOString()}] [HTTP] ${method} ${url} ${statusCode} - ${duration}ms\x1b[0m`,
    );
  }

  logDatabaseQuery(query: string, duration: number) {
    this.debug(`Query: ${query} - Duration: ${duration}ms`, 'Database');
  }

  logCacheHit(key: string) {
    this.debug(`Cache HIT: ${key}`, 'Cache');
  }

  logCacheMiss(key: string) {
    this.debug(`Cache MISS: ${key}`, 'Cache');
  }

  logUseCaseStart(useCase: string, input?: object) {
    this.log(
      `Starting ${useCase}${input ? ` with input: ${JSON.stringify(input)}` : ''}`,
      'UseCase',
    );
  }

  logUseCaseSuccess(useCase: string, result?: object) {
    this.log(
      `Completed ${useCase}${result ? ` with result: ${JSON.stringify(result)}` : ''}`,
      'UseCase',
    );
  }

  logUseCaseError(useCase: string, error: Error) {
    this.error(`Failed ${useCase}: ${error.message}`, error.stack, 'UseCase');
  }
}

