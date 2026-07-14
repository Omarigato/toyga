import { Controller, Get, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AppSettingsService } from './app-settings.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { AdminGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

@ApiTags('App Settings')
@Controller('settings')
export class AppSettingsController {
  constructor(private readonly settingsService: AppSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all settings (admin) or by category (public)' })
  @ApiQuery({ name: 'category', required: false })
  async findAll(@Query('category') category?: string) {
    return this.settingsService.findAll(category);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get setting value by key' })
  async findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Update setting (admin)' })
  async upsert(
    @Param('key') key: string,
    @Body() body: { value: any; category?: string; description?: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.settingsService.upsert(key, body.value, body.category, body.description, userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Bulk update settings (admin)' })
  async bulkUpdate(
    @Body() body: { items: Array<{ key: string; value: any; category?: string; description?: string }> },
    @CurrentUser('id') userId: string,
  ) {
    return this.settingsService.bulkUpdate(body.items, userId);
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Delete setting (admin)' })
  async delete(
    @Param('key') key: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.settingsService.delete(key, userId);
  }

  // ─── Convenience endpoints ────────────────────────────────────────

  @Get('ads/config')
  @ApiOperation({ summary: 'Get ads configuration' })
  async getAdsConfig() {
    return this.settingsService.getAdsConfig();
  }

  @Get('channels/status')
  @ApiOperation({ summary: 'Get notification channels status' })
  async getChannelsStatus() {
    return {
      whatsapp: await this.settingsService.isWhatsAppEnabled(),
      telegram: await this.settingsService.isTelegramEnabled(),
      email: await this.settingsService.isEmailEnabled(),
    };
  }
}
