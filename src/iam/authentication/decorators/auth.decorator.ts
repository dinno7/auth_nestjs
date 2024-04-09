import { SetMetadata } from '@nestjs/common';
import { AuthTypes } from '../types/auth-type.type';

export const AUTH_DECORATOR_KEY = 'authType';
export const Auth = (...args: AuthTypes[]) =>
  SetMetadata(AUTH_DECORATOR_KEY, args);
