import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { AuthRepository } from './repositories/auth.repository';
import { normalizePhone, generateOtpCode } from '../../core/utils/phone.util';
import { hashOtp, compareOtp, hashPassword, comparePassword } from '../../core/utils/bcrypt.util';
import { SYSTEM_LIMITS } from '../../common/constants/system-limits';
import { AppConfigService } from '../../core/config/app-config.service';
import { AuditService, AuditAction } from '../../core/audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
    private readonly audit: AuditService,
  ) {}

  // ─── Email/Password Registration ───────────────────────────────────────
  async register(name: string, email: string, password: string, ip?: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await this.authRepo.findUserByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictException('EMAIL_EXISTS');
    }

    const passwordHash = await hashPassword(password);
    const user = await this.authRepo.createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const tokens = await this.generateTokenPair(user.id, user.email || undefined, user.role);

    await this.audit.log({
      userId: user.id,
      action: AuditAction.USER_REGISTER,
      entityType: 'user',
      entityId: user.id,
      metadata: { email: normalizedEmail, ip },
    });

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
      ...tokens,
    };
  }

  // ─── Email/Password Login ──────────────────────────────────────────────
  async login(email: string, password: string, ip?: string, userAgent?: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.authRepo.findUserByEmail(normalizedEmail);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedException('ACCOUNT_SUSPENDED');
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const tokens = await this.generateTokenPair(user.id, user.email || undefined, user.role, ip, userAgent);

    await this.audit.log({
      userId: user.id,
      action: AuditAction.USER_LOGIN,
      entityType: 'user',
      entityId: user.id,
      metadata: { method: 'email', ip },
    });

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
      ...tokens,
    };
  }

  // ─── Admin Login ───────────────────────────────────────────────────────
  async adminLogin(email: string, password: string, ip?: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.authRepo.findUserByEmail(normalizedEmail);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    if (user.role !== 'admin') {
      throw new UnauthorizedException('ADMIN_ACCESS_REQUIRED');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedException('ACCOUNT_SUSPENDED');
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const tokens = await this.generateTokenPair(user.id, user.email || undefined, 'admin', ip);

    await this.audit.log({
      userId: user.id,
      action: AuditAction.USER_LOGIN,
      entityType: 'user',
      entityId: user.id,
      metadata: { method: 'admin', ip },
    });

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    };
  }

  // ─── OTP Request ───────────────────────────────────────────────────────
  async requestOtp(phone: string) {
    const normalized = normalizePhone(phone);
    const code = generateOtpCode();
    const codeHash = await hashOtp(code);
    const expiresAt = new Date(Date.now() + SYSTEM_LIMITS.OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.authRepo.createOtpCode(normalized, codeHash, expiresAt);

    console.log(`[OTP] Code for ${normalized}: ${code}`);

    return { success: true };
  }

  // ─── OTP Verify ────────────────────────────────────────────────────────
  async verifyOtp(phone: string, code: string, name?: string, ip?: string) {
    const normalized = normalizePhone(phone);

    const otpRecord = await this.authRepo.findValidOtp(normalized);
    if (!otpRecord) {
      throw new BadRequestException('OTP_EXPIRED');
    }

    if (otpRecord.attempts >= SYSTEM_LIMITS.MAX_OTP_ATTEMPTS) {
      throw new BadRequestException('OTP_MAX_ATTEMPTS');
    }

    const isValid = await compareOtp(code, otpRecord.codeHash);
    if (!isValid) {
      await this.authRepo.incrementOtpAttempts(otpRecord.id);
      throw new BadRequestException('OTP_INVALID');
    }

    await this.authRepo.markOtpUsed(otpRecord.id);

    const displayName = name || phone;
    const user = await this.authRepo.createOrUpdateUserByPhone(normalized, displayName);

    if (user.status === 'suspended') {
      throw new UnauthorizedException('ACCOUNT_SUSPENDED');
    }

    const tokens = await this.generateTokenPair(user.id, user.email || undefined, user.role, ip);

    await this.audit.log({
      userId: user.id,
      action: AuditAction.USER_LOGIN_OTP,
      entityType: 'user',
      entityId: user.id,
      metadata: { phone: normalized, ip },
    });

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
      ...tokens,
    };
  }

  // ─── Google OAuth ──────────────────────────────────────────────────────
  async googleLogin(profile: { googleId: string; email: string; name: string; avatarUrl?: string }, ip?: string) {
    let user: any = await this.authRepo.findUserByGoogleId(profile.googleId);

    if (!user) {
      const existingByEmail = await this.authRepo.findUserByEmail(profile.email);
      if (existingByEmail) {
        user = await this.authRepo.updateUser(existingByEmail.id, { googleId: profile.googleId, avatarUrl: profile.avatarUrl });
      } else {
        user = await this.authRepo.createUser({
          name: profile.name,
          email: profile.email,
          googleId: profile.googleId,
          avatarUrl: profile.avatarUrl,
        });
      }
    }

    if (!user) {
      throw new BadRequestException('GOOGLE_AUTH_FAILED');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedException('ACCOUNT_SUSPENDED');
    }

    const tokens = await this.generateTokenPair(user.id, user.email || undefined, user.role, ip);

    await this.audit.log({
      userId: user.id,
      action: AuditAction.USER_LOGIN_GOOGLE,
      entityType: 'user',
      entityId: user.id,
      metadata: { ip },
    });

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      ...tokens,
    };
  }

  // ─── Refresh Token ─────────────────────────────────────────────────────
  async refreshToken(refreshToken: string, ip?: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.jwtSecret,
      });

      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

      const session = await this.authRepo.findValidSession(tokenHash);
      if (!session) {
        throw new UnauthorizedException('REFRESH_TOKEN_INVALID');
      }

      const user = session.user;
      if (user.status === 'suspended') {
        throw new UnauthorizedException('ACCOUNT_SUSPENDED');
      }

      await this.authRepo.deleteAuthSession(session.id);

      const tokens = await this.generateTokenPair(user.id, user.email || undefined, user.role, ip);

      return { success: true, ...tokens };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('REFRESH_TOKEN_INVALID');
    }
  }

  // ─── Logout ────────────────────────────────────────────────────────────
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const session = await this.authRepo.findValidSession(tokenHash);
      if (session) {
        await this.authRepo.deleteAuthSession(session.id);
      }
    } else {
      await this.authRepo.deleteAllUserSessions(userId);
    }

    await this.audit.log({
      userId,
      action: AuditAction.USER_LOGOUT,
      entityType: 'user',
      entityId: userId,
    });

    return { success: true };
  }

  // ─── Get Current User ──────────────────────────────────────────────────
  async getMe(userId: string) {
    const user = await this.authRepo.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }

    return user;
  }

  // ─── Token Generation ──────────────────────────────────────────────────
  private async generateTokenPair(
    userId: string,
    email?: string,
    role: string = 'user',
    ip?: string,
    userAgent?: string,
  ) {
    const accessToken = this.jwtService.sign({
      sub: userId,
      email,
      role,
    });

    const refreshToken = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      { expiresIn: this.config.jwtRefreshExpiresIn as any },
    );

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.authRepo.createAuthSession({
      userId,
      refreshTokenHash,
      ipAddress: ip,
      userAgent,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }
}
