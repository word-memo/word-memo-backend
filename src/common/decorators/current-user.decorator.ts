import { JwtRequestUser } from '@/modules/auth/types/jwt.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtRequestUser => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: JwtRequestUser }>();
    return request.user;
  },
);
