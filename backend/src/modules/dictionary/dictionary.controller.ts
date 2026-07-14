import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DictionaryService } from './dictionary.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { AdminGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

@ApiTags('Dictionary')
@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictService: DictionaryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all dictionary entries (public)' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  async findAll(@Query('category') category?: string) {
    return this.dictService.findAll(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dictionary entry by ID' })
  async findById(@Param('id') id: string) {
    return this.dictService.findById(id);
  }

  @Get('lookup/:category/:key')
  @ApiOperation({ summary: 'Lookup dictionary value by category and key' })
  async findByCategoryAndKey(
    @Param('category') category: string,
    @Param('key') key: string,
  ) {
    return this.dictService.findByCategoryAndKey(category, key);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Create dictionary entry (admin)' })
  async create(
    @Body() body: {
      category: string;
      key: string;
      value: any;
      label?: string;
      labelRu?: string;
      labelEn?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
    @CurrentUser('id') userId: string,
  ) {
    return this.dictService.create(body, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Update dictionary entry (admin)' })
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser('id') userId: string,
  ) {
    return this.dictService.update(id, body, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Delete dictionary entry (admin)' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.dictService.delete(id, userId);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Bulk create dictionary entries (admin)' })
  async bulkCreate(
    @Body() body: { items: Array<{
      category: string;
      key: string;
      value: any;
      label?: string;
      labelRu?: string;
      labelEn?: string;
      sortOrder?: number;
    }> },
    @CurrentUser('id') userId: string,
  ) {
    return this.dictService.bulkCreate(body.items, userId);
  }
}
