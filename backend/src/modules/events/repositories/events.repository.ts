import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class EventsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.events.findMany({
      where: { userId, deletedAt: null },
      include: {
        template: { select: { id: true, name: true, slug: true, thumbnailUrl: true } },
        _count: { select: { guests: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.events.findFirst({
      where: { slug, deletedAt: null },
      include: {
        user: { select: { id: true, name: true } },
        template: { select: { id: true, name: true, slug: true, canvasJson: true, animationConfig: true, designTokens: true } },
        eventContents: { where: { deletedAt: null } },
        invitationLinks: { where: { deletedAt: null } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.events.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: { select: { id: true, name: true } },
        template: { select: { id: true, name: true, slug: true } },
        eventContents: { where: { deletedAt: null } },
        guests: { where: { deletedAt: null } },
        eventVersions: { orderBy: { versionNumber: 'desc' }, take: 1 },
      },
    });
  }

  async create(data: {
    userId: string;
    templateId: string;
    title: string;
    slug: string;
    eventType: string;
    eventDate: Date;
    location?: string;
    description?: string;
  }) {
    return this.prisma.events.create({
      data,
      include: {
        template: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.events.update({
      where: { id },
      data,
      include: {
        template: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.events.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Event Contents ──────────────────────────────────────────────────
  async upsertContent(eventId: string, canvasJson: any, contentJson: any) {
    const existing = await this.prisma.event_contents.findFirst({
      where: { eventId, deletedAt: null },
    });

    if (existing) {
      return this.prisma.event_contents.update({
        where: { id: existing.id },
        data: { canvasJson, contentJson },
      });
    }

    return this.prisma.event_contents.create({
      data: { eventId, canvasJson, contentJson },
    });
  }

  async findContent(eventId: string) {
    return this.prisma.event_contents.findFirst({
      where: { eventId, deletedAt: null },
    });
  }

  // ─── Event Versions ──────────────────────────────────────────────────
  async createVersion(eventId: string, snapshotJson: any) {
    const lastVersion = await this.prisma.event_versions.findFirst({
      where: { eventId },
      orderBy: { versionNumber: 'desc' },
    });

    const nextVersion = (lastVersion?.versionNumber || 0) + 1;

    return this.prisma.event_versions.create({
      data: {
        eventId,
        versionNumber: nextVersion,
        snapshotJson,
      },
    });
  }

  async findVersions(eventId: string) {
    return this.prisma.event_versions.findMany({
      where: { eventId },
      orderBy: { versionNumber: 'desc' },
    });
  }

  async findVersion(eventId: string, versionNumber: number) {
    return this.prisma.event_versions.findFirst({
      where: { eventId, versionNumber },
    });
  }
}
