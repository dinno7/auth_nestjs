import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './iam/iam.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ZodModule } from './zod/zod.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || ''}`,
    }),
    PrismaModule,
    IamModule,
    UsersModule,
    ZodModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
