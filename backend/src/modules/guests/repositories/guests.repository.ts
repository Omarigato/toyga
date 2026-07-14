import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class GuestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEventId(eventId: string) {
    return this.prisma.guests.findMany({
      where: { eventId, deletedAt: null },
      include: {
        rsvp: true,
        invitationLinks: { where: { deletedAt: null } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.guests.findFirst({
      where: { id, deletedAt: null },
      include: { rsvp: true, invitationLinks: { where: { deletedAt: null } } },
    });
  }

  async findByPersonalSlug(slug: string) {
    return this.prisma.guests.findFirst({
      where: { personalSlug: slug, deletedAt: null },
      include: {
        event: {
          include: {
            template: { select: { id: true, name: true, canvasJson: true, animationConfig: true, designTokens: true } },
            eventContents: { where: { deletedAt: null } },
          },
        },
        rsvp: true,
      },
    });
  }

  async create(data: {
    eventId: string;
    name: string;
    phone?: string;
    email?: string;
    personalSlug: string;
    customMessage?: string;
  }) {
    return this.prisma.guests.create({
      data,
      include: { rsvp: true, invitationLinks: { where: { deletedAt: null } } },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.guests.update({
      where: { id },
      data,
      include: { rsvp: true, invitationLinks: { where: { deletedAt: null } } },
    });
  }

  async softDelete(id: string) {
    return this.prisma.guests.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createRsvp(data: { eventId: string; guestId: string; answer: string; comment?: string }) {
    return this.prisma.rsvp.upsert({
      where: { eventId_guestId: { eventId: data.eventId, guestId: data.guestId } },
      create: data,
      update: { answer: data.answer, comment: data.comment },
    });
  }

  async createMany(guests: Array<{
    eventId: string;
    name: string;
    phone?: string;
    email?: string;
    personalSlug: string;
    customMessage?: string;
  }>) {
    return this.prisma.guests.createMany({ data: guests });
  }

  async countByEventId(eventId: string) {
    return this.prisma.guests.count({ where: { eventId, deletedAt: null } });
  }
}
