import { ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PolicyHandlerClass } from '../types/policy-handler.type';

export class RestrictEmailPolicy implements PolicyHandlerClass {
  constructor(private __domain: string = 'gmail.com') {}
  handle(user: User): boolean | Promise<boolean> {
    const isValidEmailDomain = user?.email?.endsWith(`@${this.__domain}`);
    if (!isValidEmailDomain)
      throw new ForbiddenException(
        `Your email domain is not allowed, it's should be <@${this.__domain}>`,
      );
    return true;
  }
}
