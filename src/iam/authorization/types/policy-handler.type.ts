import { ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

type PolicyHandlerResult = boolean | Promise<boolean>;

export abstract class PolicyHandlerClass {
  abstract handle(user: User, context: ExecutionContext): PolicyHandlerResult;
}

export type PolicyHandlerCallback = (
  user: User,
  context: ExecutionContext,
) => PolicyHandlerResult;

export type PolicyHandlerType = PolicyHandlerCallback | PolicyHandlerClass;
