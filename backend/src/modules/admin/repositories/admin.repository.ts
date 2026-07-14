import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [users, events, templates, guests, media, categories] = await Promise.all([
      this.prisma.users.count({ where: { deletedAt: null } }),
      this.prisma.events.count({ where: { deletedAt: null } }),
      this.prisma.templates.count({ where: { deletedAt: null } }),
      this.prisma.guests.count({ where: { deletedAt: null } }),
      this.prisma.media.count({ where: { deletedAt: null } }),
      this.prisma.categories.count({ where: { deletedAt: null } }),
    ]);
    return { users, events, templates, guests, media, categories };
  }

  // ─── Users ───────────────────────────────────────────────────────────
  async findAllUsers(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }
    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        where,
        select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.users.count({ where }),
    ]);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateUserRole(id: string, role: string) {
    return this.prisma.users.update({ where: { id }, data: { role } });
  }

  async updateUserStatus(id: string, status: string) {
    return this.prisma.users.update({ where: { id }, data: { status } });
  }

  async deleteUser(id: string) {
    return this.prisma.users.update({ where: { id }, data: { deletedAt: new Date(), status: 'deleted' as any } });
  }

  // ─── Events ──────────────────────────────────────────────────────────
  async findAllEvents(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      this.prisma.events.findMany({
        where: { deletedAt: null },
        include: {
          user: { select: { id: true, name: true, email: true } },
          template: { select: { id: true, name: true } },
          _count: { select: { guests: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.events.count({ where: { deletedAt: null } }),
    ]);
    return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── Templates ───────────────────────────────────────────────────────
  async findAllTemplates(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [templates, total] = await Promise.all([
      this.prisma.templates.findMany({
        where: { deletedAt: null },
        include: { category: { select: { id: true, name: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.templates.count({ where: { deletedAt: null } }),
    ]);
    return { templates, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── Media ───────────────────────────────────────────────────────────
  async findAllMedia(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where: { deletedAt: null },
        include: { user: { select: { id: true, name: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count({ where: { deletedAt: null } }),
    ]);
    return { media, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── Categories ──────────────────────────────────────────────────────
  async findAllCategories() {
    return this.prisma.categories.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { templates: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
