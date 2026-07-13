import { Controller, Get, Post, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'List current user media' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.mediaService.findByUserId(userId);
  }

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'List media for an event' })
  async findByEvent(@Param('eventId') eventId: string) {
    return this.mediaService.findByEventId(eventId);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'type'],
      properties: {
        file: { type: 'string', format: 'binary' },
        type: { type: 'string', enum: ['image', 'music', 'video'] },
        eventId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload media file (image, music, video)' })
  async upload(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: any,
    @Body('type') type: 'image' | 'music' | 'video',
    @Body('eventId') eventId?: string,
  ) {
    return this.mediaService.upload(userId, file, type, eventId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Delete media file' })
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.mediaService.delete(id, userId);
  }
}
