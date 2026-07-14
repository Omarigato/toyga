import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvitationLinksService } from './invitation-links.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

@ApiTags('Invitation Links')
@Controller('invitation-links')
export class InvitationLinksController {
  constructor(private readonly invitationLinksService: InvitationLinksService) {}

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'List invitation links for an event' })
  async findByEvent(@Param('eventId') eventId: string) {
    return this.invitationLinksService.findByEventId(eventId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get invitation page by link slug (public)' })
  async findBySlug(@Param('slug') slug: string) {
    return this.invitationLinksService.findBySlug(slug);
  }

  @Post('general')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Create or get general invitation link' })
  async createGeneral(
    @CurrentUser('id') userId: string,
    @Body() body: { eventId: string; customSlug?: string },
  ) {
    return this.invitationLinksService.createGeneralLink(body.eventId, body.customSlug, userId);
  }

  @Post('personal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Create personal invitation link for a guest' })
  async createPersonal(
    @CurrentUser('id') userId: string,
    @Body() body: { eventId: string; guestId: string },
  ) {
    return this.invitationLinksService.createPersonalLink(body.eventId, body.guestId, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Delete an invitation link' })
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.invitationLinksService.delete(id, userId);
  }
}
