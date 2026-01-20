import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLoggerService } from '../logger';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log(
      `Incoming request: ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
      'HTTP',
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      this.logger.logRequest(method, originalUrl, statusCode, duration);
    });

    next();
  }
}
