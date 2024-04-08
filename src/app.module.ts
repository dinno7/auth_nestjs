import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './iam/iam.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || ''}`,
    }),
    PrismaModule,
    IamModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
