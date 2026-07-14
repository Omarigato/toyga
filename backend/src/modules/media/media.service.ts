import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MediaRepository } from './repositories/media.repository';
import { StorageService, STORAGE_FOLDERS } from '../../core/storage/storage.service';
import { AuditService, AuditAction } from '../../core/audit/audit.service';
import { SYSTEM_LIMITS } from '../../common/constants/system-limits';

interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepo: MediaRepository,
    private readonly storage: StorageService,
    private readonly audit: AuditService,
  ) {}

  async findByUserId(userId: string) {
    return this.mediaRepo.findByUserId(userId);
  }

  async findByEventId(eventId: string) {
    return this.mediaRepo.findByEventId(eventId);
  }

  async findById(id: string) {
    const media = await this.mediaRepo.findById(id);
    if (!media) throw new NotFoundException('MEDIA_NOT_FOUND');
    return media;
  }

  async upload(
    userId: string,
    file: MulterFile,
    type: 'image' | 'music' | 'video',
    eventId?: string,
  ) {
    this.validateFile(file, type);

    const folder = type === 'image' ? STORAGE_FOLDERS.PHOTOS
      : type === 'music' ? STORAGE_FOLDERS.MUSIC
      : STORAGE_FOLDERS.EVENTS;

    const fileName = `${userId}/${Date.now()}_${file.originalname}`;
    const result = await this.storage.upload(folder, fileName, file.buffer, file.mimetype);

    const media = await this.mediaRepo.create({
      userId,
      eventId,
      type,
      fileName: file.originalname,
      fileUrl: result.url,
      mimeType: file.mimetype,
      size: BigInt(file.size),
      metadata: { fileId: result.fileId },
    });

    await this.audit.log({
      userId,
      action: AuditAction.MEDIA_UPLOAD,
      entityType: 'media',
      entityId: media.id,
      metadata: { type, fileName: file.originalname, size: file.size },
    });

    return media;
  }

  async delete(id: string, userId: string) {
    const media = await this.mediaRepo.findById(id);
    if (!media) throw new NotFoundException('MEDIA_NOT_FOUND');

    if (media.userId !== userId) {
      throw new BadRequestException('FORBIDDEN_ACTION');
    }

    if (media.metadata && typeof media.metadata === 'object' && 'fileId' in media.metadata) {
      await this.storage.delete((media.metadata as any).fileId);
    }

    await this.mediaRepo.softDelete(id);

    await this.audit.log({
      userId,
      action: AuditAction.MEDIA_DELETE,
      entityType: 'media',
      entityId: id,
    });

    return { success: true };
  }

  private validateFile(file: MulterFile, type: string) {
    if (!file) {
      throw new BadRequestException('MEDIA_UPLOAD_FAILED');
    }

    const limits: Record<string, { maxSize: number; allowedTypes: RegExp }> = {
      image: {
        maxSize: SYSTEM_LIMITS.IMAGE_MAX_SIZE_BYTES,
        allowedTypes: /^image\//,
      },
      music: {
        maxSize: SYSTEM_LIMITS.AUDIO_MAX_SIZE_BYTES,
        allowedTypes: /^audio\//,
      },
      video: {
        maxSize: SYSTEM_LIMITS.VIDEO_MAX_SIZE_BYTES,
        allowedTypes: /^video\//,
      },
    };

    const limit = limits[type];
    if (!limit) {
      throw new BadRequestException('MEDIA_INVALID_TYPE');
    }

    if (file.size > limit.maxSize) {
      throw new BadRequestException('MEDIA_TOO_LARGE');
    }

    if (!limit.allowedTypes.test(file.mimetype)) {
      throw new BadRequestException('MEDIA_INVALID_TYPE');
    }
  }
}
