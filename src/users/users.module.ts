import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, ForgotPasswordService],
  exports: [UsersService, ForgotPasswordService],
})
export class UsersModule {}
