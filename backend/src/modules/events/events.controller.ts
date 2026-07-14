import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AutosaveDto } from './dto/autosave.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'List current user events' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.eventsService.findByUserId(userId);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get event by slug (public, for invitation page)' })
  async findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Get event details by ID' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Create a new event from template' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateEventDto) {
    return this.eventsService.create({ ...dto, userId });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Update event details' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.update(id, dto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Delete an event' })
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.eventsService.delete(id, userId);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Publish an event (make it publicly visible)' })
  async publish(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.eventsService.publish(id, userId);
  }

  @Post(':id/autosave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Autosave editor content' })
  async autosave(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: AutosaveDto,
  ) {
    return this.eventsService.autosave(id, userId, dto);
  }

  @Post(':id/versions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Save current state as a version snapshot' })
  async saveVersion(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.eventsService.saveVersion(id, userId);
  }

  @Get(':id/versions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'List all versions for an event' })
  async getVersions(@Param('id') id: string) {
    return this.eventsService.getVersions(id);
  }

  @Post(':id/versions/:version/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Restore a specific version' })
  async restoreVersion(
    @Param('id') id: string,
    @Param('version') version: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.restoreVersion(id, parseInt(version, 10), userId);
  }
}
