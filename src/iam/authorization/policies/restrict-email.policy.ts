import { User } from '@prisma/client';
import { PolicyHandlerClass } from '../types/policy-handler.type';

export class RestrictEmailPolicy implements PolicyHandlerClass {
  constructor(private __domain: string = 'gmail.com') {}
  handle(user: User): boolean | Promise<boolean> {
    return user?.email?.endsWith(`@${this.__domain}`);
  }
}
