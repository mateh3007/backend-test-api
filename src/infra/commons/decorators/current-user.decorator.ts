import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ICurrentUser {
  id: string;
  email: string;
  role: string;
  companyId?: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof ICurrentUser | undefined, ctx: ExecutionContext): ICurrentUser | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as ICurrentUser;

    return data ? user?.[data] : user;
  },
);

