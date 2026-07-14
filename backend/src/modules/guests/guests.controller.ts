import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GuestsService } from './guests.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { BulkImportGuestsDto } from './dto/bulk-import-guests.dto';

@ApiTags('Guests')
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'List guests for an event' })
  async findByEvent(@Param('eventId') eventId: string) {
    return this.guestsService.findByEventId(eventId);
  }

  @Get('personal/:slug')
  @ApiOperation({ summary: 'Get guest page by personal slug (public)' })
  async findBySlug(@Param('slug') slug: string) {
    return this.guestsService.findByPersonalSlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Add a guest to an event' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateGuestDto) {
    return this.guestsService.create(dto, userId);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Import multiple guests (Excel/CSV foundation)' })
  async bulkImport(@CurrentUser('id') userId: string, @Body() dto: BulkImportGuestsDto) {
    return this.guestsService.createMany(dto.eventId, dto.guests, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Update a guest' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGuestDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.guestsService.update(id, dto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Remove a guest' })
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.guestsService.delete(id, userId);
  }

  @Post('rsvp')
  @ApiOperation({ summary: 'Submit RSVP response (public, no auth)' })
  async submitRsvp(@Body() body: { eventId: string; guestId: string; answer: string; comment?: string }) {
    return this.guestsService.submitRsvp(body);
  }
}
