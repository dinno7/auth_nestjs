import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ForgotPasswordService {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(id: string) {
    return this.prisma.forgotPassword.findUnique({
      where: { userId: id },
    });
  }

  findByToken(token: string) {
    return this.prisma.forgotPassword.findUnique({
      where: { token },
    });
  }

  isExpires(
    forgotPassword: Prisma.ForgotPasswordWhereUniqueInput | null,
  ): boolean {
    return !forgotPassword || forgotPassword.expires <= new Date();
  }

  async upsert(userId: string, hashedToken: string) {
    const forgotPasswordExist = await this.findByUserId(userId);

    return this.prisma.forgotPassword.upsert({
      create: {
        token: hashedToken,
        userId,
      },
      where: { userId },
      update: {
        token: hashedToken,
        expires: this.isExpires(forgotPasswordExist)
          ? new Date(Date.now() + 1000 * 60 * 10)
          : forgotPasswordExist.expires,
      },
    });
  }

  deleteByUserId(id: string) {
    return this.prisma.forgotPassword.deleteMany({ where: { userId: id } });
  }
}
