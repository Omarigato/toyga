import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { normalizePhone } from '../../../core/utils/phone.util';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Users ─────────────────────────────────────────────────────────────
  async findUserByEmail(email: string) {
    return this.prisma.users.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async findUserByPhone(phone: string) {
    return this.prisma.users.findFirst({
      where: { phone: normalizePhone(phone), deletedAt: null },
    });
  }

  async findUserById(id: string) {
    return this.prisma.users.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true, name: true, email: true, phone: true,
        avatarUrl: true, role: true, status: true, createdAt: true,
      },
    });
  }

  async findUserByGoogleId(googleId: string) {
    return this.prisma.users.findFirst({
      where: { googleId, deletedAt: null },
    });
  }

  async createUser(data: {
    name: string;
    email?: string;
    phone?: string;
    passwordHash?: string;
    googleId?: string;
    avatarUrl?: string;
  }) {
    return this.prisma.users.create({
      data: {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone ? normalizePhone(data.phone) : undefined,
        passwordHash: data.passwordHash || undefined,
        googleId: data.googleId || undefined,
        avatarUrl: data.avatarUrl || undefined,
      },
    });
  }

  async updateUser(id: string, data: { name?: string; avatarUrl?: string; googleId?: string }) {
    return this.prisma.users.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true, role: true },
    });
  }

  async createOrUpdateUserByPhone(phone: string, name: string) {
    const normalized = normalizePhone(phone);
    const existing = await this.prisma.users.findFirst({
      where: { phone: normalized, deletedAt: null },
    });

    if (existing) {
      return this.prisma.users.update({
        where: { id: existing.id },
        data: { name: name || existing.name },
        select: { id: true, name: true, email: true, phone: true, avatarUrl: true, role: true, status: true },
      });
    }

    return this.prisma.users.create({
      data: { name, phone: normalized },
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true, role: true, status: true },
    });
  }

  // ─── OTP ───────────────────────────────────────────────────────────────
  async createOtpCode(phone: string, codeHash: string, expiresAt: Date) {
    return this.prisma.otp_codes.create({
      data: { phone: normalizePhone(phone), codeHash, expiresAt },
    });
  }

  async findValidOtp(phone: string) {
    return this.prisma.otp_codes.findFirst({
      where: {
        phone: normalizePhone(phone),
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async incrementOtpAttempts(id: string) {
    return this.prisma.otp_codes.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
  }

  async markOtpUsed(id: string) {
    return this.prisma.otp_codes.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  // ─── Auth Sessions (Refresh Tokens) ────────────────────────────────────
  async createAuthSession(data: {
    userId: string;
    refreshTokenHash: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }) {
    return this.prisma.auth_sessions.create({ data });
  }

  async findValidSession(refreshTokenHash: string) {
    return this.prisma.auth_sessions.findFirst({
      where: {
        refreshTokenHash,
        deletedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: { select: { id: true, name: true, email: true, role: true, status: true } },
      },
    });
  }

  async deleteAuthSession(id: string) {
    return this.prisma.auth_sessions.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async deleteAllUserSessions(userId: string) {
    return this.prisma.auth_sessions.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  async cleanExpiredSessions() {
    return this.prisma.auth_sessions.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
