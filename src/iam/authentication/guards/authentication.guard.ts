import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_DECORATOR_KEY } from '../decorators/auth.decorator';
import { AuthTypes } from '../types/auth-type.type';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly __defaultAuthType = AuthTypes.Bearer;
  private readonly __authTypesMap: Record<
    AuthTypes,
    CanActivate | CanActivate[]
  > = {
    [AuthTypes.None]: { canActivate: () => true },
    [AuthTypes.Bearer]: this.accessTokenGuard,
    [AuthTypes.ApiKey]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const mustValidateGuards = this.__extractAuthTypesFromRoutes(context);

      //? Check all route Auth types and if one of them is passed return it's value
      const canActivate = await Promise.any(
        mustValidateGuards.map((guard) =>
          Promise.resolve(guard.canActivate(context)),
        ),
      );

      return canActivate === true;
    } catch (error) {
      const errMsg = JSON.parse(JSON.stringify(error['errors']))
        ?.map((e) => e['message'])
        ?.join(', ');
      throw new UnauthorizedException(errMsg || 'You are not authorize');
    }
  }

  private __extractRouteAuthTypes(context: ExecutionContext) {
    return this.reflector.getAllAndOverride(AUTH_DECORATOR_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
  private __extractAuthTypesFromRoutes(context: ExecutionContext) {
    const routeAuths = this.__extractRouteAuthTypes(context) || [
      AuthenticationGuard.__defaultAuthType,
    ];

    return routeAuths.map((guardKey) => this.__authTypesMap[guardKey]).flat();
  }

  public async provideUserIfAuthTypeIsNone(context: ExecutionContext) {
    const authType = this.__extractRouteAuthTypes(context) || [];

    return authType?.includes(AuthTypes.None)
      ? (<AccessTokenGuard>this.__authTypesMap[AuthTypes.Bearer]).canActivate(
          context,
        )
      : undefined;
  }
}
