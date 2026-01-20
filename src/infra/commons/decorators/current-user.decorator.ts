import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface ICurrentUser {
  id: string;
  email: string;
  role: string;
  companyId?: string;
}

interface RequestWithUser extends Request {
  user: ICurrentUser;
}

export const CurrentUser = createParamDecorator(
  (
    data: keyof ICurrentUser | undefined,
    ctx: ExecutionContext,
  ): ICurrentUser | string | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
