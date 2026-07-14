import { Injectable } from '@nestjs/common';

export interface UploadResult {
  fileId: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface StorageFolder {
  TEMPLATES: string;
  USERS: string;
  EVENTS: string;
  MUSIC: string;
  PHOTOS: string;
}

export const STORAGE_FOLDERS: StorageFolder = {
  TEMPLATES: 'Templates',
  USERS: 'Users',
  EVENTS: 'Events',
  MUSIC: 'Music',
  PHOTOS: 'Photos',
};

@Injectable()
export abstract class StorageService {
  abstract upload(
    folder: string,
    fileName: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<UploadResult>;

  abstract delete(fileId: string): Promise<void>;

  abstract getUrl(fileId: string): string;

  abstract getSignedUrl(fileId: string, expiresIn?: number): Promise<string>;
}
