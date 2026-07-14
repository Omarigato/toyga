import { Injectable, OnModuleInit } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import { StorageService, UploadResult } from './storage.service';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class GoogleDriveStorage extends StorageService implements OnModuleInit {
  private drive: drive_v3.Drive;
  private rootFolderId: string;
  private folderCache = new Map<string, string>();

  constructor(private readonly config: AppConfigService) {
    super();
  }

  async onModuleInit() {
    this.rootFolderId = this.config.googleDriveFolderId;

    if (!this.config.googleDriveClientEmail || !this.config.googleDrivePrivateKey) {
      console.warn('[Storage] Google Drive credentials not configured. Storage will use simulation mode.');
      return;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: this.config.googleDriveClientEmail,
        private_key: this.config.googleDrivePrivateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    this.drive = google.drive({ version: 'v3', auth });
    console.log('[Storage] Google Drive initialized');
  }

  async upload(
    folder: string,
    fileName: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<UploadResult> {
    if (!this.drive) {
      return this.simulateUpload(fileName, mimeType, buffer.length);
    }

    const parentFolderId = await this.getOrCreateFolder(folder);

    const response = await this.drive.files.create({
      requestBody: {
        name: fileName,
        parents: [parentFolderId],
      },
      media: {
        mimeType,
        body: Readable.from(buffer),
      },
      fields: 'id, mimeType, size',
    });

    const fileId = response.data.id!;
    return {
      fileId,
      url: this.getUrl(fileId),
      mimeType: response.data.mimeType || mimeType,
      size: parseInt(response.data.size || '0', 10),
    };
  }

  async delete(fileId: string): Promise<void> {
    if (!this.drive) {
      console.log(`[Storage] [SIMULATION] Delete file: ${fileId}`);
      return;
    }

    await this.drive.files.delete({ fileId });
  }

  getUrl(fileId: string): string {
    if (!fileId) return '';
    return `https://drive.google.com/uc?id=${fileId}&export=view`;
  }

  async getSignedUrl(fileId: string, expiresIn: number = 3600): Promise<string> {
    if (!this.drive) {
      return this.getUrl(fileId);
    }

    const response = await this.drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' },
    );

    return this.getUrl(fileId);
  }

  private async getOrCreateFolder(name: string): Promise<string> {
    if (this.folderCache.has(name)) {
      return this.folderCache.get(name)!;
    }

    const query = `name='${name}' and mimeType='application/vnd.google-apps.folder' and '${this.rootFolderId}' in parents and trashed=false`;
    const response = await this.drive.files.list({
      q: query,
      fields: 'files(id)',
      spaces: 'drive',
    });

    if (response.data.files && response.data.files.length > 0) {
      const folderId = response.data.files[0].id!;
      this.folderCache.set(name, folderId);
      return folderId;
    }

    const newFolder = await this.drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [this.rootFolderId],
      },
      fields: 'id',
    });

    const folderId = newFolder.data.id!;
    this.folderCache.set(name, folderId);
    return folderId;
  }

  private simulateUpload(fileName: string, mimeType: string, size: number): UploadResult {
    const fileId = `sim_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    console.log(`[Storage] [SIMULATION] Upload: ${fileName} (${mimeType}, ${size} bytes)`);
    return {
      fileId,
      url: `/api/v1/media/file/${fileId}`,
      mimeType,
      size,
    };
  }
}
