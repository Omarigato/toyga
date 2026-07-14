import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export enum AuditAction {
  // Auth
  USER_REGISTER = 'user.register',
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  USER_LOGIN_GOOGLE = 'user.login_google',
  USER_LOGIN_OTP = 'user.login_otp',
  USER_PASSWORD_CHANGE = 'user.password_change',

  // Events
  EVENT_CREATE = 'event.create',
  EVENT_UPDATE = 'event.update',
  EVENT_DELETE = 'event.delete',
  EVENT_PUBLISH = 'event.publish',
  EVENT_AUTOSAVE = 'event.autosave',

  // Templates
  TEMPLATE_CREATE = 'template.create',
  TEMPLATE_UPDATE = 'template.update',
  TEMPLATE_DELETE = 'template.delete',

  // Categories
  CATEGORY_CREATE = 'category.create',
  CATEGORY_UPDATE = 'category.update',
  CATEGORY_DELETE = 'category.delete',

  // Media
  MEDIA_UPLOAD = 'media.upload',
  MEDIA_DELETE = 'media.delete',

  // Guests
  GUEST_CREATE = 'guest.create',
  GUEST_UPDATE = 'guest.update',
  GUEST_DELETE = 'guest.delete',
  GUEST_IMPORT = 'guest.import',

  // WhatsApp
  WHATSAPP_SEND = 'whatsapp.send',
  WHATSAPP_BROADCAST = 'whatsapp.broadcast',

  // Admin
  ADMIN_USER_UPDATE = 'admin.user_update',
  ADMIN_USER_DELETE = 'admin.user_delete',

  // Invitation Links
  INVITATION_LINK_CREATE = 'invitation_link.create',
  INVITATION_LINK_VISIT = 'invitation_link.visit',

  // Dictionary (V3)
  DICTIONARY_CREATE = 'dictionary.create',
  DICTIONARY_UPDATE = 'dictionary.update',
  DICTIONARY_DELETE = 'dictionary.delete',

  // App Settings (V3)
  APP_SETTINGS_UPDATE = 'app_settings.update',

  // Notifications (V3)
  NOTIFICATION_SEND = 'notification.send',
  NOTIFICATION_BROADCAST = 'notification.broadcast',
  NOTIFICATION_CANCEL = 'notification.cancel',

  // Template Cloning (V3)
  TEMPLATE_CLONE = 'template.clone',
  TEMPLATE_IMPORT = 'template.import',
  TEMPLATE_EXPORT = 'template.export',

  // Guest Import Excel (V3)
  GUEST_IMPORT_EXCEL = 'guest.import_excel',
  GUEST_EXPORT_EXCEL = 'guest.export_excel',
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    userId?: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      await this.prisma.audit_logs.create({
        data: {
          userId: params.userId || undefined,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          metadata: params.metadata || {},
        },
      });
    } catch (error) {
      console.error('[Audit] Failed to write audit log:', error);
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    entityType?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.action) where.action = params.action;
    if (params.entityType) where.entityType = params.entityType;

    const [logs, total] = await Promise.all([
      this.prisma.audit_logs.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.audit_logs.count({ where }),
    ]);

    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
