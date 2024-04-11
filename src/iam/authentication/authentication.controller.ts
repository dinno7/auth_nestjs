import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { ReceiveUserEmailDto } from './dtos/receive-user-email.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
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
  @HttpCode(HttpStatus.OK)
  signOut(@Body() { refreshToken }: SignOutDto) {
    return this.authService.signOut(refreshToken);
  }

  @Post('refresh')
  @Auth(AuthTypes.None)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('forgot-password')
  @Auth(AuthTypes.None)
  forgotPassword(@Body() { email }: ReceiveUserEmailDto) {
    return this.authService.forgetPassword({ email });
  }

  @Post('reset-password')
  @Auth(AuthTypes.None)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
