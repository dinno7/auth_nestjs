import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/iam/configs/jwt.config';
import { REQUEST_USER_KEY } from 'src/iam/iam.constant';
import { UsersService } from 'src/users/users.service';
import { AccessTokenPayload } from '../types/token-payload.type';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigurations: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = <Request>context.switchToHttp().getRequest();

    try {
      const token = this.__extractToken(req);

      if (!token) throw new Error();

      const { type, id } = <AccessTokenPayload>(
        await this.jwtService.verifyAsync(token, {
          secret: this.jwtConfigurations.secret,
          audience: this.jwtConfigurations.audience,
          issuer: this.jwtConfigurations.issuer,
        })
      );
      if (type !== 'access') throw new Error();
      const user = await this.userService.getUserById(id);
      if (!user) throw new Error();

      req[REQUEST_USER_KEY] = user;
    } catch (error) {
      throw new UnauthorizedException(error?.message || 'Invalid access token');
    }

    return true;
  }

  private __extractToken(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
