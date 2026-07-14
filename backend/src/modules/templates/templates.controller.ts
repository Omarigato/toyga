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
