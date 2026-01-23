import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
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
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const url = request.url;

    // 1. Lista de exclusão rigorosa para o Swagger e arquivos estáticos
    if (
      url.includes('/api/docs') || 
      url.includes('swagger-ui') || 
      url.includes('favicon.ico')
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const contentType = response.getHeader('content-type');
        if (contentType && !contentType.toString().includes('application/json')) {
          return data;
        }

        return {
          success: true,
          data: data ?? null,
          timestamp: new Date().toISOString(),
          path: url,
          statusCode: response.statusCode,
        };
      }),
    );
  }
}

