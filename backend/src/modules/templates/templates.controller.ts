import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard, AdminGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@ApiTags('Templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'List all published templates' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category slug' })
  async findAll(@Query('category') category?: string) {
    return this.templatesService.findAll(category);
  }

  @Get('marketplace')
  @ApiOperation({ summary: 'Get marketplace templates with ratings and download counts' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'source', required: false, enum: ['original', 'cloned', 'imported'] })
  async marketplace(
    @Query('category') category?: string,
    @Query('source') source?: string,
  ) {
    return this.templatesService.findMarketplace(category, source);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID with assets' })
  async findOne(@Param('id') id: string) {
    return this.templatesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Create a new template (admin only)' })
  async create(@Body() dto: CreateTemplateDto, @CurrentUser('id') userId: string) {
    return this.templatesService.create(dto, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Update a template (admin only)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.templatesService.update(id, dto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Delete a template (admin only)' })
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.templatesService.delete(id, userId);
  }

  // ─── V3: Template Cloning ──────────────────────────────────────────

  @Post(':id/clone')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Clone a template (creates a personal copy)' })
  async clone(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.templatesService.clone(id, userId);
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Rate a template (1-5)' })
  async rate(
    @Param('id') id: string,
    @Body() body: { rating: number },
  ) {
    return this.templatesService.updateRating(id, body.rating);
  }

  // ─── V3: Template Import/Export ────────────────────────────────────

  @Post('import')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Import template from JSON/HTML/ZIP (admin only)' })
  async importTemplate(@CurrentUser('id') userId: string, @Body() body: any) {
    // TODO: Implement template import (Etap 8)
    return { message: 'Template import endpoint - will be implemented in Etap 8' };
  }

  @Get(':id/export')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Export template as JSON (admin only)' })
  async exportTemplate(@Param('id') id: string) {
    const template = await this.templatesService.findById(id);
    return {
      template: {
        name: template.name,
        slug: template.slug,
        description: template.description,
        categoryId: template.categoryId,
        canvasJson: template.canvasJson,
        animationConfig: template.animationConfig,
        designTokens: template.designTokens,
        assets: template.assets,
      },
    };
  }

  // ─── Template Assets ────────────────────────────────────────────────

  @Post(':id/assets')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Add asset to template (admin only)' })
  async addAsset(
    @Param('id') id: string,
    @Body() body: { type: string; url: string; name: string; metadata?: any },
  ) {
    return this.templatesService.addAsset(id, body);
  }

  @Delete(':templateId/assets/:assetId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Remove asset from template (admin only)' })
  async removeAsset(@Param('assetId') assetId: string) {
    return this.templatesService.removeAsset(assetId);
  }
}
