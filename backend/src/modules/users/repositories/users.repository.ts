import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.users.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true, role: true, status: true, createdAt: true },
    });
  }

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        where: { deletedAt: null },
        select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.users.count({ where: { deletedAt: null } }),
    ]);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id: string, data: { name?: string; avatarUrl?: string }) {
    return this.prisma.users.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
    });
  }

  async softDelete(id: string) {
    return this.prisma.users.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'deleted' },
    });
  }
}
