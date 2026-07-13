import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { generateSlug } from '../../core/utils/phone.util';
import { AuditService, AuditAction } from '../../core/audit/audit.service';

@Injectable()
export class InvitationLinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findByEventId(eventId: string) {
    return this.prisma.invitation_links.findMany({
      where: { eventId, deletedAt: null },
      include: {
        guest: { select: { id: true, name: true, personalSlug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const link = await this.prisma.invitation_links.findFirst({
      where: { slug, deletedAt: null },
      include: {
        event: {
          include: {
            template: { select: { id: true, name: true, canvasJson: true, animationConfig: true, designTokens: true } },
            eventContents: { where: { deletedAt: null } },
            user: { select: { id: true, name: true } },
          },
        },
        guest: { include: { rsvp: true } },
      },
    });

    if (link) {
      await this.trackVisit(link.id);
    }

    return link;
  }

  async createGeneralLink(eventId: string, customSlug?: string, userId?: string) {
    const existingGeneral = await this.prisma.invitation_links.findFirst({
      where: { eventId, isPersonal: false, deletedAt: null },
    });

    if (existingGeneral) {
      return existingGeneral;
    }

    let slug = customSlug || generateSlug(8);
    if (customSlug) {
      const existing = await this.prisma.invitation_links.findFirst({
        where: { slug, deletedAt: null },
      });
      if (existing) throw new ConflictException('INVITATION_LINK_EXISTS');
    }

    const link = await this.prisma.invitation_links.create({
      data: { eventId, slug, isPersonal: false },
    });

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.INVITATION_LINK_CREATE,
        entityType: 'invitation_link',
        entityId: link.id,
        metadata: { type: 'general', eventId },
      });
    }

    return link;
  }

  async createPersonalLink(eventId: string, guestId: string, userId?: string) {
    const existing = await this.prisma.invitation_links.findFirst({
      where: { eventId, guestId, isPersonal: true, deletedAt: null },
    });

    if (existing) return existing;

    const slug = generateSlug(8);

    const link = await this.prisma.invitation_links.create({
      data: { eventId, guestId, slug, isPersonal: true },
    });

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.INVITATION_LINK_CREATE,
        entityType: 'invitation_link',
        entityId: link.id,
        metadata: { type: 'personal', eventId, guestId },
      });
    }

    return link;
  }

  async delete(id: string, userId?: string) {
    const link = await this.prisma.invitation_links.findFirst({
      where: { id, deletedAt: null },
    });
    if (!link) throw new NotFoundException('INVITATION_LINK_NOT_FOUND');

    await this.prisma.invitation_links.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { success: true };
  }

  private async trackVisit(linkId: string) {
    try {
      const link = await this.prisma.invitation_links.findUnique({ where: { id: linkId } });
      if (link?.guestId) {
        await this.prisma.guests.update({
          where: { id: link.guestId },
          data: { status: 'viewed' },
        });
      }
    } catch (error) {
      console.error('[InvitationLinks] Failed to track visit:', error);
    }
  }
}
