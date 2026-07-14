import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TemplatesRepository } from './repositories/templates.repository';
import { AuditService, AuditAction } from '../../core/audit/audit.service';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly templatesRepo: TemplatesRepository,
    private readonly audit: AuditService,
  ) {}

  async findAll(categorySlug?: string, includeAll: boolean = false) {
    return this.templatesRepo.findAll(categorySlug, includeAll);
  }

  async findById(id: string) {
    const template = await this.templatesRepo.findById(id);
    if (!template) throw new NotFoundException('TEMPLATE_NOT_FOUND');
    return template;
  }

  async findBySlug(slug: string) {
    const template = await this.templatesRepo.findBySlug(slug);
    if (!template) throw new NotFoundException('TEMPLATE_NOT_FOUND');
    return template;
  }

  async create(data: {
    categoryId: string;
    name: string;
    slug: string;
    description?: string;
    previewUrl?: string;
    thumbnailUrl?: string;
    canvasJson?: any;
    animationConfig?: any;
    designTokens?: any;
    isPremium?: boolean;
    status?: string;
    source?: string;
    originalTemplateId?: string;
    priceKzt?: number;
  }, userId?: string) {
    if (data.slug) {
      const existing = await this.templatesRepo.findBySlug(data.slug);
      if (existing) throw new ConflictException('TEMPLATE_SLUG_EXISTS');
    }

    const template = await this.templatesRepo.create(data);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.TEMPLATE_CREATE,
        entityType: 'template',
        entityId: template.id,
        metadata: { name: data.name, slug: data.slug },
      });
    }

    return template;
  }

  async update(id: string, data: any, userId?: string) {
    const template = await this.templatesRepo.findById(id);
    if (!template) throw new NotFoundException('TEMPLATE_NOT_FOUND');

    if (data.slug) {
      const existing = await this.templatesRepo.findBySlug(data.slug);
      if (existing && existing.id !== id) throw new ConflictException('TEMPLATE_SLUG_EXISTS');
    }

    const updated = await this.templatesRepo.update(id, data);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.TEMPLATE_UPDATE,
        entityType: 'template',
        entityId: id,
        metadata: { changes: Object.keys(data) },
      });
    }

    return updated;
  }

  async delete(id: string, userId?: string) {
    const template = await this.templatesRepo.findById(id);
    if (!template) throw new NotFoundException('TEMPLATE_NOT_FOUND');

    await this.templatesRepo.softDelete(id);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.TEMPLATE_DELETE,
        entityType: 'template',
        entityId: id,
        metadata: { name: template.name },
      });
    }

    return { success: true };
  }

  // ─── V3: Template Cloning ──────────────────────────────────────────

  async clone(templateId: string, userId: string) {
    const template = await this.templatesRepo.findById(templateId);
    if (!template) throw new NotFoundException('TEMPLATE_NOT_FOUND');

    const cloned = await this.templatesRepo.clone(templateId, userId);
    if (!cloned) throw new ConflictException('TEMPLATE_CLONE_FAILED');

    await this.audit.log({
      userId,
      action: AuditAction.TEMPLATE_CLONE,
      entityType: 'template',
      entityId: cloned.id,
      metadata: { originalId: templateId, originalName: template.name },
    });

    return cloned;
  }

  // ─── V3: Marketplace ───────────────────────────────────────────────

  async findMarketplace(categorySlug?: string, source?: string) {
    return this.templatesRepo.findMarketplace(categorySlug, source);
  }

  async incrementDownloadCount(id: string) {
    return this.templatesRepo.incrementDownloadCount(id);
  }

  async updateRating(id: string, rating: number) {
    return this.templatesRepo.updateRating(id, rating);
  }

  // ─── Template Assets ────────────────────────────────────────────────

  async addAsset(templateId: string, data: { type: string; url: string; name: string; metadata?: any }) {
    await this.findById(templateId);
    return this.templatesRepo.addAsset(templateId, data);
  }

  async removeAsset(assetId: string) {
    return this.templatesRepo.removeAsset(assetId);
  }

  async getAssets(templateId: string) {
    await this.findById(templateId);
    return this.templatesRepo.findAssets(templateId);
  }
}
