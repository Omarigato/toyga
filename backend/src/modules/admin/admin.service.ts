import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminRepository } from './repositories/admin.repository';
import { AuditService, AuditAction } from '../../core/audit/audit.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly audit: AuditService,
  ) {}

  async getStats() {
    return this.adminRepo.getStats();
  }

  // ─── Users ───────────────────────────────────────────────────────────
  async findAllUsers(page?: number, limit?: number, search?: string) {
    return this.adminRepo.findAllUsers(page, limit, search);
  }

  async updateUserRole(id: string, role: string, adminId: string) {
    const updated = await this.adminRepo.updateUserRole(id, role);
    await this.audit.log({
      userId: adminId,
      action: AuditAction.ADMIN_USER_UPDATE,
      entityType: 'user',
      entityId: id,
      metadata: { field: 'role', value: role },
    });
    return updated;
  }

  async updateUserStatus(id: string, status: string, adminId: string) {
    const updated = await this.adminRepo.updateUserStatus(id, status);
    await this.audit.log({
      userId: adminId,
      action: AuditAction.ADMIN_USER_UPDATE,
      entityType: 'user',
      entityId: id,
      metadata: { field: 'status', value: status },
    });
    return updated;
  }

  async deleteUser(id: string, adminId: string) {
    await this.adminRepo.deleteUser(id);
    await this.audit.log({
      userId: adminId,
      action: AuditAction.ADMIN_USER_DELETE,
      entityType: 'user',
      entityId: id,
    });
    return { success: true };
  }

  // ─── Events ──────────────────────────────────────────────────────────
  async findAllEvents(page?: number, limit?: number) {
    return this.adminRepo.findAllEvents(page, limit);
  }

  // ─── Templates ───────────────────────────────────────────────────────
  async findAllTemplates(page?: number, limit?: number) {
    return this.adminRepo.findAllTemplates(page, limit);
  }

  // ─── Media ───────────────────────────────────────────────────────────
  async findAllMedia(page?: number, limit?: number) {
    return this.adminRepo.findAllMedia(page, limit);
  }

  // ─── Categories ──────────────────────────────────────────────────────
  async findAllCategories() {
    return this.adminRepo.findAllCategories();
  }
}
