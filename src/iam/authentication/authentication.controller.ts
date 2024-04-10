import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignOutDto } from './dtos/sign-out.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthTypes } from './types/auth-type.type';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  @Post('signup')
  @Auth(AuthTypes.None)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @Auth(AuthTypes.None)
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signout')
  signOut(@Body() { refreshToken }: SignOutDto) {
    return this.authService.signOut(refreshToken);
  }

  @Post('refresh')
  @Auth(AuthTypes.None)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() password: string) {
    // TODO: Implement forgot password
  }
}
