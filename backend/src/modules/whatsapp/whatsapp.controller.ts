import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsAppService } from './whatsapp.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

@ApiTags('WhatsApp')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'List WhatsApp messages for an event' })
  async findByEvent(@Param('eventId') eventId: string) {
    return this.whatsappService.findByEventId(eventId);
  }

  @Post('send')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Send a single WhatsApp message' })
  async send(
    @CurrentUser('id') userId: string,
    @Body() body: { eventId: string; guestId?: string; phone: string; message: string },
  ) {
    return this.whatsappService.sendMessage({ ...body, userId });
  }

  @Post('broadcast')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Broadcast messages to multiple guests' })
  async broadcast(
    @CurrentUser('id') userId: string,
    @Body() body: {
      eventId: string;
      guests: Array<{ guestId: string; phone: string; message: string }>;
    },
  ) {
    return this.whatsappService.broadcast({ ...body, userId });
  }
}
