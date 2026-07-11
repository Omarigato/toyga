import type { IEventRepository, DbEvent } from '../repositories/interfaces/IEventRepository';
import { NotFoundError } from '../../../api/_core/errors';

export class EventService {
  constructor(private eventRepo: IEventRepository) {}

  async listAllEvents(): Promise<DbEvent[]> {
    return this.eventRepo.findAll();
  }

  async getEventBySlug(slug: string): Promise<DbEvent> {
    const event = await this.eventRepo.findBySlug(slug);
    if (!event) {
      throw new NotFoundError('Invitation', slug);
    }
    return event;
  }

  async createEvent(data: {
    userId: number;
    templateId?: number;
    slug: string;
    ownerName: string;
    ownerPhone?: string;
    type: string;
    eventDate: string;
    audioUrl?: string;
    location?: string;
    lat?: number;
    lng?: number;
    customData?: any;
  }) {
    return this.eventRepo.create(data);
  }
}
