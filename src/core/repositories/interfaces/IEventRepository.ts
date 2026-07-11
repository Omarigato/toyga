export interface DbEvent {
  id: number;
  template_id: number | null;
  short_slug: string;
  owner_name: string;
  owner_phone: string | null;
  event_type: string;
  event_date: string;
  event_location: string | null;
  event_lat: number | null;
  event_lng: number | null;
  audio_url: string | null;
  status: string;
  template_title?: string;
  custom_data?: any;
}

export interface IEventRepository {
  findAll(): Promise<DbEvent[]>;
  findBySlug(slug: string): Promise<DbEvent | null>;
  create(data: {
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
  }): Promise<{ id: number; slug: string; templateId?: number; title: string; type: string; eventDate: string }>;
}
