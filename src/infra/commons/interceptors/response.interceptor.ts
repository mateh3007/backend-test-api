import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const url = request.url ?? '';

    if (
      url.startsWith('/api/docs') ||
      url.startsWith('/api/health')
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const contentType = response.getHeader('content-type');

        if (
          typeof contentType === 'string' &&
          !contentType.includes('application/json')
        ) {
          return data;
        }

        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
          statusCode: response.statusCode,
        };
      }),
    );
  }
}

