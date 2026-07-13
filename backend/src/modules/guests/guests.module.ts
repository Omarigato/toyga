import { Module } from '@nestjs/common';
import { GuestsController } from './guests.controller';
import { GuestsService } from './guests.service';
import { GuestsRepository } from './repositories/guests.repository';
import { InvitationLinksService } from './invitation-links.service';
import { InvitationLinksController } from './invitation-links.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [GuestsController, InvitationLinksController],
  providers: [GuestsService, GuestsRepository, InvitationLinksService],
  exports: [GuestsService, InvitationLinksService],
})
export class GuestsModule {}
