import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { generateSlug } from '../../../core/utils/phone.util';

@Injectable()
export class TemplatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(categorySlug?: string, includeAll: boolean = false) {
    const where: any = { deletedAt: null };
    if (!includeAll) where.status = 'published';
    if (categorySlug) {
      where.category = { slug: categorySlug, deletedAt: null };
    }
    return this.prisma.templates.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        assets: { where: { deletedAt: null }, select: { id: true, type: true, url: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.templates.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        assets: { where: { deletedAt: null } },
        originalTemplate: { select: { id: true, name: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.templates.findFirst({
      where: { slug, deletedAt: null },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        assets: { where: { deletedAt: null } },
      },
    });
  }

  async create(data: any) {
    return this.prisma.templates.create({
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.templates.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.templates.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ─── V3: Template Cloning ────────────────────────────────────────────

  async clone(originalId: string, clonedByUserId: string) {
    const original = await this.prisma.templates.findFirst({
      where: { id: originalId, deletedAt: null },
      include: { assets: { where: { deletedAt: null } } },
    });

    if (!original) return null;

    let newSlug = generateSlug(10);
    let attempts = 0;
    while (attempts < 10) {
      const existing = await this.findBySlug(newSlug);
      if (!existing) break;
      newSlug = generateSlug(10);
      attempts++;
    }

    const cloned = await this.prisma.templates.create({
      data: {
        categoryId: original.categoryId,
        name: `${original.name} (копия)`,
        slug: newSlug,
        description: original.description,
        previewUrl: original.previewUrl,
        thumbnailUrl: original.thumbnailUrl,
        canvasJson: original.canvasJson as any,
        animationConfig: original.animationConfig as any,
        designTokens: original.designTokens as any,
        isPremium: false,
        status: 'published',
        originalTemplateId: originalId,
        clonedBy: clonedByUserId,
        source: 'cloned',
        priceKzt: 0,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    // Clone assets
    if (original.assets.length > 0) {
      await this.prisma.template_assets.createMany({
        data: original.assets.map(asset => ({
          templateId: cloned.id,
          type: asset.type,
          url: asset.url,
          name: asset.name,
          metadata: asset.metadata as any,
        })),
      });
    }

    // Increment download count on original
    await this.prisma.templates.update({
      where: { id: originalId },
      data: { downloadCount: { increment: 1 } },
    });

    return this.findById(cloned.id);
  }

  // ─── V3: Marketplace queries ─────────────────────────────────────────

  async findMarketplace(categorySlug?: string, source?: string) {
    const where: any = {
      deletedAt: null,
      status: 'published',
    };
    if (categorySlug) {
      where.category = { slug: categorySlug, deletedAt: null };
    }
    if (source) {
      where.source = source;
    }

    return this.prisma.templates.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        assets: { where: { deletedAt: null }, select: { id: true, type: true, url: true, name: true } },
        _count: { select: { events: true, clonedTemplates: true } },
      },
      orderBy: [{ downloadCount: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async incrementDownloadCount(id: string) {
    return this.prisma.templates.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });
  }

  async updateRating(id: string, rating: number) {
    const template = await this.prisma.templates.findUnique({ where: { id } });
    if (!template) return;

    const newCount = template.ratingCount + 1;
    const newAvg = (Number(template.ratingAvg) * template.ratingCount + rating) / newCount;

    return this.prisma.templates.update({
      where: { id },
      data: {
        ratingAvg: newAvg,
        ratingCount: newCount,
      },
    });
  }

  // ─── Template Assets ─────────────────────────────────────────────────
  async addAsset(templateId: string, data: { type: string; url: string; name: string; metadata?: any }) {
    return this.prisma.template_assets.create({
      data: { templateId, ...data },
    });
  }

  async removeAsset(assetId: string) {
    return this.prisma.template_assets.update({
      where: { id: assetId },
      data: { deletedAt: new Date() },
    });
  }

  async findAssets(templateId: string) {
    return this.prisma.template_assets.findMany({
      where: { templateId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }
}
