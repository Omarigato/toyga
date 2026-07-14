import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

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
