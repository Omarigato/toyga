import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventsRepository } from './repositories/events.repository';
import { generateSlug } from '../../core/utils/phone.util';
import { AuditService, AuditAction } from '../../core/audit/audit.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepo: EventsRepository,
    private readonly audit: AuditService,
  ) {}

  async findByUserId(userId: string) {
    return this.eventsRepo.findByUserId(userId);
  }

  async findBySlug(slug: string) {
    const event = await this.eventsRepo.findBySlug(slug);
    if (!event) throw new NotFoundException('EVENT_NOT_FOUND');
    return event;
  }

  async findById(id: string) {
    const event = await this.eventsRepo.findById(id);
    if (!event) throw new NotFoundException('EVENT_NOT_FOUND');
    return event;
  }

  async create(data: {
    userId: string;
    templateId: string;
    title: string;
    eventType: string;
    eventDate: Date;
    location?: string;
    description?: string;
  }) {
    let slug = generateSlug(8);
    let attempts = 0;
    while (attempts < 10) {
      const existing = await this.eventsRepo.findBySlug(slug);
      if (!existing) break;
      slug = generateSlug(8);
      attempts++;
    }

    const event = await this.eventsRepo.create({ ...data, slug });

    await this.audit.log({
      userId: data.userId,
      action: AuditAction.EVENT_CREATE,
      entityType: 'event',
      entityId: event.id,
      metadata: { title: data.title, eventType: data.eventType },
    });

    return event;
  }

  async update(id: string, data: any, userId?: string) {
    const event = await this.eventsRepo.findById(id);
    if (!event) throw new NotFoundException('EVENT_NOT_FOUND');

    if (userId && event.userId !== userId) {
      throw new BadRequestException('FORBIDDEN_ACTION');
    }

    const updated = await this.eventsRepo.update(id, data);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.EVENT_UPDATE,
        entityType: 'event',
        entityId: id,
        metadata: { changes: Object.keys(data) },
      });
    }

    return updated;
  }

  async delete(id: string, userId?: string) {
    const event = await this.eventsRepo.findById(id);
    if (!event) throw new NotFoundException('EVENT_NOT_FOUND');

    if (userId && event.userId !== userId) {
      throw new BadRequestException('FORBIDDEN_ACTION');
    }

    await this.eventsRepo.softDelete(id);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.EVENT_DELETE,
        entityType: 'event',
        entityId: id,
        metadata: { title: event.title },
      });
    }

    return { success: true };
  }

  async publish(id: string, userId: string) {
    const event = await this.eventsRepo.findById(id);
    if (!event) throw new NotFoundException('EVENT_NOT_FOUND');

    if (event.userId !== userId) {
      throw new BadRequestException('FORBIDDEN_ACTION');
    }

    const updated = await this.eventsRepo.update(id, { status: 'published' });

    await this.audit.log({
      userId,
      action: AuditAction.EVENT_PUBLISH,
      entityType: 'event',
      entityId: id,
      metadata: { title: event.title },
    });

    return updated;
  }

  // ─── Autosave ────────────────────────────────────────────────────────
  async autosave(eventId: string, userId: string, data: { canvasJson?: any; contentJson?: any }) {
    const event = await this.eventsRepo.findById(eventId);
    if (!event) throw new NotFoundException('EVENT_NOT_FOUND');

    if (event.userId !== userId) {
      throw new BadRequestException('FORBIDDEN_ACTION');
    }

    const content = await this.eventsRepo.upsertContent(
      eventId,
      data.canvasJson || event.eventContents?.[0]?.canvasJson || {},
      data.contentJson || event.eventContents?.[0]?.contentJson || {},
    );

    return content;
  }

  // ─── Versions ────────────────────────────────────────────────────────
  async saveVersion(eventId: string, userId: string) {
    const event = await this.eventsRepo.findById(eventId);
    if (!event) throw new NotFoundException('EVENT_NOT_FOUND');

    if (event.userId !== userId) {
      throw new BadRequestException('FORBIDDEN_ACTION');
    }

    const content = event.eventContents?.[0];
    const snapshot = {
      event: {
        title: event.title,
        eventType: event.eventType,
        eventDate: event.eventDate,
        location: event.location,
        description: event.description,
      },
      canvasJson: content?.canvasJson || {},
      contentJson: content?.contentJson || {},
      savedAt: new Date().toISOString(),
    };

    return this.eventsRepo.createVersion(eventId, snapshot);
  }

  async getVersions(eventId: string) {
    return this.eventsRepo.findVersions(eventId);
  }

  async restoreVersion(eventId: string, versionNumber: number, userId: string) {
    const event = await this.eventsRepo.findById(eventId);
    if (!event) throw new NotFoundException('EVENT_NOT_FOUND');

    if (event.userId !== userId) {
      throw new BadRequestException('FORBIDDEN_ACTION');
    }

    const version = await this.eventsRepo.findVersion(eventId, versionNumber);
    if (!version) throw new NotFoundException('Version not found');

    const snapshot = version.snapshotJson as any;
    await this.eventsRepo.upsertContent(eventId, snapshot.canvasJson, snapshot.contentJson);

    return { success: true, restoredVersion: versionNumber };
  }
}
