import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { REQUEST_USER_KEY } from 'src/iam/iam.constant';
import {
  SET_POLICIES_DECORATOR_KEY,
  SetPolicies,
} from '../decorators/set-policy.decorator';
import { PolicyHandlerType } from '../types/policy-handler.type';

export function Policies(...policies: PolicyHandlerType[]) {
  return applyDecorators(SetPolicies(...policies), UseGuards(PolicyGuard));
}

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePolicies = this.__extractRoutePolicies(context);
    if (!routePolicies) return true;

    try {
      const user = <User>context.switchToHttp().getRequest()[REQUEST_USER_KEY];

      const policiesResolvedArr = await Promise.all(
        routePolicies.map((policy) =>
          Promise.resolve(
            typeof policy === 'function'
              ? policy(user, context)
              : policy.handle(user, context),
          ),
        ),
      );

      if (!policiesResolvedArr.every((r) => r)) throw new Error();

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new ForbiddenException('You have not access to this resource');
    }
  }

  private __extractRoutePolicies(ctx: ExecutionContext) {
    return this.reflector.getAllAndOverride<PolicyHandlerType[]>(
      SET_POLICIES_DECORATOR_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
  }
}
