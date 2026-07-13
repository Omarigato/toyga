import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class WhatsAppRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEventId(eventId: string) {
    return this.prisma.whatsapp_messages.findMany({
      where: { eventId },
      include: { guest: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.whatsapp_messages.findFirst({ where: { id } });
  }

  async create(data: {
    eventId: string;
    guestId?: string;
    phone: string;
    message: string;
    scheduledAt?: Date;
  }) {
    return this.prisma.whatsapp_messages.create({ data });
  }

  async createMany(messages: Array<{
    eventId: string;
    guestId?: string;
    phone: string;
    message: string;
    scheduledAt?: Date;
  }>) {
    return this.prisma.whatsapp_messages.createMany({ data: messages });
  }

  async updateStatus(id: string, status: string, sentAt?: Date, errorMessage?: string) {
    return this.prisma.whatsapp_messages.update({
      where: { id },
      data: { status, sentAt, errorMessage },
    });
  }

  async incrementAttempts(id: string) {
    return this.prisma.whatsapp_messages.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
  }

  async findPending() {
    return this.prisma.whatsapp_messages.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByEventAndStatus(eventId: string, status: string) {
    return this.prisma.whatsapp_messages.findMany({
      where: { eventId, status },
    });
  }
}
