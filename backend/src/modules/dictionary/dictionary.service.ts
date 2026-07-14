import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DictionaryRepository } from './repositories/dictionary.repository';
import { AuditService, AuditAction } from '../../core/audit/audit.service';

@Injectable()
export class DictionaryService {
  constructor(
    private readonly dictRepo: DictionaryRepository,
    private readonly audit: AuditService,
  ) {}

  async findAll(category?: string) {
    return this.dictRepo.findAll(category);
  }

  async findById(id: string) {
    const item = await this.dictRepo.findById(id);
    if (!item) throw new NotFoundException('DICTIONARY_NOT_FOUND');
    return item;
  }

  async findByCategoryAndKey(category: string, key: string) {
    return this.dictRepo.findByCategoryAndKey(category, key);
  }

  async create(data: {
    category: string;
    key: string;
    value: any;
    label?: string;
    labelRu?: string;
    labelEn?: string;
    sortOrder?: number;
    isActive?: boolean;
  }, userId?: string) {
    const existing = await this.dictRepo.findByCategoryAndKey(data.category, data.key);
    if (existing) throw new ConflictException('DICTIONARY_KEY_EXISTS');

    const item = await this.dictRepo.create(data);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.DICTIONARY_CREATE,
        entityType: 'dictionary',
        entityId: item.id,
        metadata: { category: data.category, key: data.key },
      });
    }

    return item;
  }

  async update(id: string, data: any, userId?: string) {
    const item = await this.dictRepo.findById(id);
    if (!item) throw new NotFoundException('DICTIONARY_NOT_FOUND');

    const updated = await this.dictRepo.update(id, data);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.DICTIONARY_UPDATE,
        entityType: 'dictionary',
        entityId: id,
        metadata: { changes: Object.keys(data) },
      });
    }

    return updated;
  }

  async delete(id: string, userId?: string) {
    const item = await this.dictRepo.findById(id);
    if (!item) throw new NotFoundException('DICTIONARY_NOT_FOUND');

    await this.dictRepo.softDelete(id);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.DICTIONARY_DELETE,
        entityType: 'dictionary',
        entityId: id,
        metadata: { category: item.category, key: item.key },
      });
    }

    return { success: true };
  }

  async bulkCreate(items: Array<{
    category: string;
    key: string;
    value: any;
    label?: string;
    labelRu?: string;
    labelEn?: string;
    sortOrder?: number;
  }>, userId?: string) {
    const result = await this.dictRepo.createMany(items);

    if (userId) {
      await this.audit.log({
        userId,
        action: AuditAction.DICTIONARY_CREATE,
        entityType: 'dictionary',
        entityId: 'bulk',
        metadata: { count: items.length },
      });
    }

    return { success: true, count: result.count };
  }
}
