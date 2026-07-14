import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { GuestsRepository } from './repositories/guests.repository';
import { generateSlug } from '../../core/utils/phone.util';
import { AuditService, AuditAction } from '../../core/audit/audit.service';

@Injectable()
export class GuestsService {
  constructor(
    private readonly guestsRepo: GuestsRepository,
    private readonly audit: AuditService,
  ) {}

  async findByEventId(eventId: string) {
    return this.guestsRepo.findByEventId(eventId);
  }

  async findById(id: string) {
    const guest = await this.guestsRepo.findById(id);
    if (!guest) throw new NotFoundException('GUEST_NOT_FOUND');
    return guest;
  }

  async findByPersonalSlug(slug: string) {
    const guest = await this.guestsRepo.findByPersonalSlug(slug);
    if (!guest) throw new NotFoundException('GUEST_NOT_FOUND');
    return guest;
  }

  async create(data: {
    eventId: string;
    name: string;
    phone?: string;
    email?: string;
    customMessage?: string;
    telegramUsername?: string;
    groupKey?: string;
    groupRole?: string;
    partnerGuestId?: string;
  }, userId?: string) {
    let personalSlug = generateSlug(8);
    let attempts = 0;
    while (attempts < 10) {
      const existing = await this.guestsRepo.findByPersonalSlug(personalSlug);
      if (!existing) break;
      personalSlug = generateSlug(8);
      attempts++;
    }

    const guest = await this.guestsRepo.create({
      ...data,
      personalSlug,
      groupRole: data.groupRole || 'primary',
    });

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.GUEST_CREATE,
        entityType: 'guest',
        entityId: guest.id,
        metadata: { name: data.name, eventId: data.eventId },
      });
    }

    return guest;
  }

  async createMany(eventId: string, guests: Array<{
    name: string;
    phone?: string;
    email?: string;
    customMessage?: string;
    telegramUsername?: string;
    groupKey?: string;
    groupRole?: string;
    partnerGuestId?: string;
  }>, userId?: string) {
    const guestData = guests.map((g, index) => ({
      eventId,
      name: g.name,
      phone: g.phone,
      email: g.email,
      personalSlug: generateSlug(8),
      customMessage: g.customMessage,
      telegramUsername: g.telegramUsername,
      groupKey: g.groupKey,
      groupRole: g.groupRole || 'primary',
      partnerGuestId: g.partnerGuestId,
      sortOrder: index,
    }));

    await this.guestsRepo.createMany(guestData);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.GUEST_IMPORT,
        entityType: 'guest',
        entityId: eventId,
        metadata: { count: guests.length },
      });
    }

    return { success: true, count: guests.length };
  }

  async update(id: string, data: any, userId?: string) {
    const guest = await this.guestsRepo.findById(id);
    if (!guest) throw new NotFoundException('GUEST_NOT_FOUND');

    const updated = await this.guestsRepo.update(id, data);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.GUEST_UPDATE,
        entityType: 'guest',
        entityId: id,
        metadata: { changes: Object.keys(data) },
      });
    }

    return updated;
  }

  async delete(id: string, userId?: string) {
    const guest = await this.guestsRepo.findById(id);
    if (!guest) throw new NotFoundException('GUEST_NOT_FOUND');

    await this.guestsRepo.softDelete(id);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.GUEST_DELETE,
        entityType: 'guest',
        entityId: id,
        metadata: { name: guest.name },
      });
    }

    return { success: true };
  }

  async submitRsvp(data: {
    eventId: string;
    guestId: string;
    answer: string;
    comment?: string;
  }) {
    const guest = await this.guestsRepo.findById(data.guestId);
    if (!guest) throw new NotFoundException('GUEST_NOT_FOUND');

    const rsvpStatus = data.answer === 'yes' ? 'confirmed'
      : data.answer === 'no' ? 'declined'
      : 'maybe';

    await this.guestsRepo.update(data.guestId, { rsvpStatus });
    return this.guestsRepo.createRsvp(data);
  }

  async getGuestCount(eventId: string) {
    return this.guestsRepo.countByEventId(eventId);
  }

  // ─── V3: Group operations ──────────────────────────────────────────

  async findGroupsByEventId(eventId: string) {
    return this.guestsRepo.findGroupsByEventId(eventId);
  }

  // ─── V3: Send status tracking ──────────────────────────────────────

  async updateSendStatus(
    guestId: string,
    channel: 'whatsapp' | 'telegram' | 'email',
    status: string,
    error?: string,
  ) {
    const guest = await this.guestsRepo.findById(guestId);
    if (!guest) throw new NotFoundException('GUEST_NOT_FOUND');

    return this.guestsRepo.updateSendStatus(guestId, channel, status, error);
  }

  async getSendStatusSummary(eventId: string) {
    return this.guestsRepo.findSendStatusSummary(eventId);
  }
}
