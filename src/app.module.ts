import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || ''}`,
    }),
    PrismaModule,
    IamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
