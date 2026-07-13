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
      throw new NotFoundError('Event', slug);
    }
    return event;
  }

  async getEventById(id: number): Promise<DbEvent> {
    const event = await this.eventRepo.findById(id);
    if (!event) {
      throw new NotFoundError('Event');
    }
    return event;
  }

  async createEvent(data: {
    userId: number;
    templateId?: number | null;
    title: string;
    slug: string;
    type: string;
    descriptionHtml?: string | null;
    eventDate: string;
    program?: any[];
    hashtag?: string | null;
    audioUrl?: string | null;
    videoUrl?: string | null;
    linkMode?: string;
    address?: {
      address_text: string;
      place_name?: string | null;
      lat?: number | null;
      lng?: number | null;
      map_link?: string | null;
    } | null;
  }): Promise<DbEvent> {
    return this.eventRepo.create(data);
  }

  async updateEvent(id: number, data: {
    templateId?: number | null;
    title?: string;
    type?: string;
    descriptionHtml?: string | null;
    eventDate?: string;
    program?: any[];
    hashtag?: string | null;
    audioUrl?: string | null;
    videoUrl?: string | null;
    linkMode?: string;
    status?: string;
    address?: {
      address_text: string;
      place_name?: string | null;
      lat?: number | null;
      lng?: number | null;
      map_link?: string | null;
    } | null;
  }): Promise<DbEvent> {
    return this.eventRepo.update(id, data);
  }
}
