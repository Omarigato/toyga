export interface DbEvent {
  id: number;
  user_id: number;
  template_id: number | null;
  title: string;
  slug: string;
  type: string;
  description_html: string | null;
  event_date: string;
  program: any[];
  hashtag: string | null;
  audio_url: string | null;
  video_url: string | null;
  status: string;
  link_mode: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  
  // Fields joined from event_addresses
  address_text?: string | null;
  place_name?: string | null;
  lat?: number | null;
  lng?: number | null;
  map_link?: string | null;

  // Joined template fields
  template_title?: string;
}

export interface IEventRepository {
  findAll(): Promise<DbEvent[]>;
  findBySlug(slug: string): Promise<DbEvent | null>;
  findById(id: number): Promise<DbEvent | null>;
  create(data: {
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
  }): Promise<DbEvent>;
  update(id: number, data: {
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
  }): Promise<DbEvent>;
}
