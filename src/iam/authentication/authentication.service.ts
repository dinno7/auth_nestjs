import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';
import jwtConfig from '../configs/jwt.config';
import { HashingService } from '../hashing/hashing.service';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { InvalidRefreshTokenException } from './exceptions/invalid-refresh-token.exeption';
import { RefreshTokenPayload } from './types/token-payload.type';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigurations: ConfigType<typeof jwtConfig>,

    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly userService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const isUserExist = await this.userService.getUserByEmail(signUpDto.email);
    if (isUserExist)
      throw new BadRequestException(
        `This user by email(${signUpDto.email}) is already exist`,
      );

    const hashedPassword = await this.hashingService.hash(signUpDto.password);

    return this.userService.createUser({
      name: signUpDto.name,
      email: signUpDto.email?.toLowerCase(),
      password: hashedPassword,
    });
  }
  async signIn(signInDto: SignInDto) {
    const errorMsg = 'This email and password combination is not valid';

    const user = await this.userService.getUserByEmail(signInDto.email);
    if (!user) throw new NotFoundException(errorMsg);

    const isPasswordValid = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) throw new BadRequestException(errorMsg);

    const { accessToken, refreshToken } = await this.__generateTokens(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signOut(refreshToken: string) {
    try {
      const {
        type,
        tokenId,
        id: userId,
      } = <RefreshTokenPayload>await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfigurations.refreshTokenSecret,
        audience: this.jwtConfigurations.audience,
        issuer: this.jwtConfigurations.issuer,
      });

      if (type !== 'refresh') throw new Error();

      const user = await this.userService.getUserById(userId);
      if (!user) throw new Error();

      if (!(await this.redisService.remove(tokenId))) throw new Error();

      return true;
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async refreshToken({ refreshToken: receivedToken }: RefreshTokenDto) {
    try {
      const {
        type,
        tokenId,
        id: userId,
      } = <RefreshTokenPayload>await this.jwtService.verifyAsync(
        receivedToken,
        {
          secret: this.jwtConfigurations.refreshTokenSecret,
          audience: this.jwtConfigurations.audience,
          issuer: this.jwtConfigurations.issuer,
        },
      );

      if (type !== 'refresh') throw new Error();

      const user = await this.userService.getUserById(userId);
      if (!user) throw new Error();

      const isRefreshTokenValid = await this.redisService.validate(
        tokenId,
        receivedToken,
      );

      // -> It's mean one malicious user will try to use refresh token(Auto Reuse Detection)
      if (!isRefreshTokenValid)
        throw new InvalidRefreshTokenException('Access denied');

      // -> Just sure that refresh token will be remove successfully
      if (!(await this.redisService.remove(tokenId))) throw new Error();

      return this.__generateTokens(userId);
    } catch (err) {
      if (err instanceof InvalidRefreshTokenException) {
        //-> Notify user that refresh token was stolen and get hacked
        throw err;
      }
      throw new BadRequestException('Invalid refresh token');
    }
  }

  private __signToken<P extends Record<string, unknown> | Buffer>(
    secret: string,
    expiresIn: number,
    payload: P,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
      audience: this.jwtConfigurations.audience,
      issuer: this.jwtConfigurations.issuer,
    });
  }

  private async __generateTokens(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const refreshTokenId = `user_${randomUUID()}`;

    const [accessToken, refreshToken] = await Promise.all([
      this.__signToken(
        this.jwtConfigurations.secret,
        this.jwtConfigurations.accessTtl,
        {
          type: 'access',
          id: userId,
        },
      ),
      this.__signToken(
        this.jwtConfigurations.refreshTokenSecret,
        this.jwtConfigurations.refreshTtl,
        {
          type: 'refresh',
          id: userId,
          tokenId: refreshTokenId,
        },
      ),
    ]);

    // -> Add refresh token to memory for refresh token aut
    this.redisService.insert(refreshTokenId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
