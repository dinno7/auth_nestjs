import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import jwtConfig from '../configs/jwt.config';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigurations: ConfigType<typeof jwtConfig>,

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
      email: signUpDto.email,
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

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  private signToken<P extends Record<string, unknown> | Buffer>(
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

  private async generateTokens(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(
        this.jwtConfigurations.secret,
        this.jwtConfigurations.accessTtl,
        {
          type: 'access',
          id: userId,
        },
      ),
      this.signToken(
        this.jwtConfigurations.secret,
        this.jwtConfigurations.accessTtl,
        {
          type: 'refresh',
          id: userId,
        },
      ),
    ]);

    // TODO: Add refresh token rotation

    return {
      accessToken,
      refreshToken,
    };
  }
}
