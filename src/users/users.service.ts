import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  getUserById(id: string, include?: Prisma.UserInclude) {
    return this.prisma.user.findUnique({ where: { id }, include });
  }
  getUserByEmail(email: string, include?: Prisma.UserInclude) {
    return this.prisma.user.findUnique({ where: { email }, include });
  }

  async createUser(user: Prisma.UserCreateInput) {
    const existUser = await this.getUserByEmail(user.email);
    if (existUser) throw new BadRequestException('This user exist');

    return this.prisma.user.create({
      data: user,
    });
  }

  updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
