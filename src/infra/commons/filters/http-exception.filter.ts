import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface IApiError {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
  path: string;
  statusCode: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res.message as string) || exception.message;
      }

      code = this.getErrorCode(status);
    } else if (exception instanceof Error) {
      message = exception.message;
      code = this.mapErrorToCode(exception.message);
      status = this.mapErrorToStatus(exception.message);
    }

    const errorResponse: IApiError = {
      success: false,
      error: {
        code,
        message,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
    };

    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}`,
    );

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      500: 'INTERNAL_ERROR',
    };
    return codes[status] || 'UNKNOWN_ERROR';
  }

  private mapErrorToCode(message: string): string {
    if (message.includes('not found')) return 'NOT_FOUND';
    if (message.includes('already exists')) return 'CONFLICT';
    if (message.includes('Invalid credentials')) return 'UNAUTHORIZED';
    if (message.includes('permission')) return 'FORBIDDEN';
    if (message.includes('Insufficient')) return 'BAD_REQUEST';
    return 'INTERNAL_ERROR';
  }

  private mapErrorToStatus(message: string): number {
    if (message.includes('not found')) return HttpStatus.NOT_FOUND;
    if (message.includes('already exists')) return HttpStatus.CONFLICT;
    if (message.includes('Invalid credentials')) return HttpStatus.UNAUTHORIZED;
    if (message.includes('permission')) return HttpStatus.FORBIDDEN;
    if (message.includes('Insufficient')) return HttpStatus.BAD_REQUEST;
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

