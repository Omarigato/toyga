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
        partnerGuest: { select: { id: true, name: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: string) {
    return this.prisma.guests.findFirst({
      where: { id, deletedAt: null },
      include: {
        rsvp: true,
        invitationLinks: { where: { deletedAt: null } },
        partnerGuest: { select: { id: true, name: true } },
        partneredGuests: { select: { id: true, name: true } },
      },
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
        partneredGuests: { select: { id: true, name: true } },
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
    telegramUsername?: string;
    groupKey?: string;
    groupRole?: string;
    partnerGuestId?: string;
    sortOrder?: number;
  }) {
    return this.prisma.guests.create({
      data,
      include: {
        rsvp: true,
        invitationLinks: { where: { deletedAt: null } },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.guests.update({
      where: { id },
      data,
      include: {
        rsvp: true,
        invitationLinks: { where: { deletedAt: null } },
        partnerGuest: { select: { id: true, name: true } },
      },
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
    telegramUsername?: string;
    groupKey?: string;
    groupRole?: string;
    partnerGuestId?: string;
    sortOrder?: number;
  }>) {
    return this.prisma.guests.createMany({ data: guests });
  }

  async countByEventId(eventId: string) {
    return this.prisma.guests.count({ where: { eventId, deletedAt: null } });
  }

  // ─── V3: Group queries ───────────────────────────────────────────────

  async findGroupsByEventId(eventId: string) {
    const guests = await this.prisma.guests.findMany({
      where: { eventId, deletedAt: null, groupKey: { not: null } },
      orderBy: [{ groupKey: 'asc' }, { sortOrder: 'asc' }],
    });

    const groupMap = new Map<string, typeof guests>();
    for (const guest of guests) {
      const key = guest.groupKey!;
      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key)!.push(guest);
    }

    return Array.from(groupMap.entries()).map(([key, members]) => ({
      key,
      label: members[0]?.name || key,
      primaryGuest: members.find(m => m.groupRole === 'primary') || members[0],
      members,
    }));
  }

  async updateSendStatus(
    guestId: string,
    channel: 'whatsapp' | 'telegram' | 'email',
    status: string,
    error?: string,
  ) {
    const data: any = {};
    const statusKey = `${channel}Status` as const;
    const sentAtKey = `${channel}SentAt` as const;
    const errorKey = `${channel}Error` as const;

    data[statusKey] = status;
    if (status === 'sent' || status === 'delivered') {
      data[sentAtKey] = new Date();
    }
    if (error) {
      data[errorKey] = error;
    }

    return this.prisma.guests.update({
      where: { id: guestId },
      data,
    });
  }

  async findSendStatusSummary(eventId: string) {
    const guests = await this.prisma.guests.findMany({
      where: { eventId, deletedAt: null },
      select: {
        whatsappStatus: true,
        telegramStatus: true,
        emailStatus: true,
        rsvpStatus: true,
      },
    });

    return {
      total: guests.length,
      whatsapp: {
        pending: guests.filter(g => g.whatsappStatus === 'pending').length,
        sent: guests.filter(g => g.whatsappStatus === 'sent').length,
        delivered: guests.filter(g => g.whatsappStatus === 'delivered').length,
        failed: guests.filter(g => g.whatsappStatus === 'failed').length,
      },
      telegram: {
        pending: guests.filter(g => g.telegramStatus === 'pending').length,
        sent: guests.filter(g => g.telegramStatus === 'sent').length,
        delivered: guests.filter(g => g.telegramStatus === 'delivered').length,
        failed: guests.filter(g => g.telegramStatus === 'failed').length,
      },
      email: {
        pending: guests.filter(g => g.emailStatus === 'pending').length,
        sent: guests.filter(g => g.emailStatus === 'sent').length,
        delivered: guests.filter(g => g.emailStatus === 'delivered').length,
        failed: guests.filter(g => g.emailStatus === 'failed').length,
      },
      rsvp: {
        pending: guests.filter(g => g.rsvpStatus === 'pending').length,
        confirmed: guests.filter(g => g.rsvpStatus === 'confirmed').length,
        declined: guests.filter(g => g.rsvpStatus === 'declined').length,
        maybe: guests.filter(g => g.rsvpStatus === 'maybe').length,
      },
    };
  }
}
