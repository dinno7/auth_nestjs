import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { IamModule } from './iam/iam.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { ZodModule } from './zod/zod.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
    }),
    PrismaModule,
    IamModule,
    UsersModule,
    ZodModule,
    RedisModule,
    CommonModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
