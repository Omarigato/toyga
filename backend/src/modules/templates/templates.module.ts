import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { CategoriesController } from './categories.controller';
import { TemplatesService } from './templates.service';
import { CategoriesService } from './categories.service';
import { TemplatesRepository } from './repositories/templates.repository';
import { CategoriesRepository } from './repositories/categories.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TemplatesController, CategoriesController],
  providers: [TemplatesService, CategoriesService, TemplatesRepository, CategoriesRepository],
  exports: [TemplatesService, CategoriesService],
})
export class TemplatesModule {}
