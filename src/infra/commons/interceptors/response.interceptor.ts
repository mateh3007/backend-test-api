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
    const url = request.url;
  
    if (url.includes('api/docs') || url.includes('favicon.ico')) {
      return next.handle();
    }
  
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        
        if (data instanceof StreamableFile || !data) {
          return data;
        }
  
        if (url.endsWith('-json')) {
          return data;
        }
  
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          path: url,
        };
      }),
    );
  }
}

