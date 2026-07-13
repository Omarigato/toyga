import type { ITemplateRepository, DbTemplate } from '../repositories/interfaces/ITemplateRepository';
import type { CreateTemplateInput, UpdateTemplateInput } from '../validation/templates';
import { NotFoundError, ConflictError } from '../../../api/_core/errors';

export class TemplateService {
  constructor(private templateRepo: ITemplateRepository) {}

  async listTemplates(filters: { categorySlug?: string; activeOnly?: boolean }): Promise<DbTemplate[]> {
    return this.templateRepo.findAll(filters);
  }

  async getTemplateById(id: number): Promise<DbTemplate> {
    const template = await this.templateRepo.findById(id);
    if (!template) {
      throw new NotFoundError('Template', id);
    }
    return template;
  }

  async createTemplate(data: CreateTemplateInput): Promise<DbTemplate> {
    // Check if code is already taken
    if (data.code) {
      const existing = await this.templateRepo.findByCode(data.code);
      if (existing) {
        throw new ConflictError(`Template code "${data.code}" is already in use.`, 'code');
      }
    }
    return this.templateRepo.create(data);
  }

  async updateTemplate(id: number, data: UpdateTemplateInput): Promise<DbTemplate> {
    if (data.code) {
      const existing = await this.templateRepo.findByCode(data.code);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Template code "${data.code}" is already in use.`, 'code');
      }
    }
    const template = await this.templateRepo.update(id, data);
    if (!template) {
      throw new NotFoundError('Template', id);
    }
    return template;
  }

  async deleteTemplate(id: number): Promise<void> {
    const deleted = await this.templateRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError('Template', id);
    }
  }
}
