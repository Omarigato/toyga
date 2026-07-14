import { Module } from '@nestjs/common';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { DictionaryRepository } from './repositories/dictionary.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DictionaryController],
  providers: [DictionaryService, DictionaryRepository],
  exports: [DictionaryService],
})
export class DictionaryModule {}
