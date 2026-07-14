import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { GoogleDriveStorage } from './google-drive.storage';

@Module({
  providers: [
    {
      provide: StorageService,
      useClass: GoogleDriveStorage,
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
