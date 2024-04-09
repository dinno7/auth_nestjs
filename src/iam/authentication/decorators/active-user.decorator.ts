import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/iam/iam.constant';

export const ActiveUser = createParamDecorator((data, ctx) => {
  const user = <Request>ctx.switchToHttp().getRequest()[REQUEST_USER_KEY];
  return user ? (data ? user[data] : user) : null;
});
