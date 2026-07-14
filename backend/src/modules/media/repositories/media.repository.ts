import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.media.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEventId(eventId: string) {
    return this.prisma.media.findMany({
      where: { eventId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.media.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(data: {
    userId: string;
    eventId?: string;
    type: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    size: bigint;
    metadata?: any;
  }) {
    return this.prisma.media.create({ data });
  }

  async softDelete(id: string) {
    return this.prisma.media.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
