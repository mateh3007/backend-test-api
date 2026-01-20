import { HttpStatus } from '@nestjs/common';

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode: number;
}

export abstract class BaseController {
  protected success<T>(data: T, statusCode = HttpStatus.OK): IApiResponse<T> {
    return {
      success: true,
      data,
      statusCode,
    };
  }

  protected created<T>(data: T): IApiResponse<T> {
    return this.success(data, HttpStatus.CREATED);
  }

  protected noContent(): IApiResponse<null> {
    return {
      success: true,
      statusCode: HttpStatus.NO_CONTENT,
    };
  }
}
