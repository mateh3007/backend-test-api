import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log(
      `[REQUEST] ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;
      const duration = Date.now() - startTime;

      const logLevel =
        statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'log';

      this.logger[logLevel](
        `[RESPONSE] ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms - Size: ${contentLength}B`,
      );
    });

    next();
  }
}
