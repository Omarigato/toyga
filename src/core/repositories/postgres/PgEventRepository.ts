import type { IEventRepository, DbEvent } from '../interfaces/IEventRepository';
import { query } from '../../../../api/_core/db';

export class PgEventRepository implements IEventRepository {
  async findAll(): Promise<DbEvent[]> {
    const { rows } = await query<DbEvent>(`
      SELECT 
        e.id,
        e.template_id,
        e.slug as short_slug,
        COALESCE(u.name, e.title) as owner_name,
        u.phone as owner_phone,
        e.type as event_type,
        e.event_date::text,
        ea.address_text as event_location,
        ea.lat as event_lat,
        ea.lng as event_lng,
        e.audio_url,
        e.status,
        t.title_kk as template_title,
        ei.content as custom_data
      FROM events e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN templates t ON e.template_id = t.id
      LEFT JOIN event_addresses ea ON ea.event_id = e.id
      LEFT JOIN event_invitations ei ON ei.event_id = e.id
      WHERE e.deleted_at IS NULL
      ORDER BY e.created_at DESC
    `);
    return rows;
  }

  async findBySlug(slug: string): Promise<DbEvent | null> {
    const { rows } = await query<DbEvent>(`
      SELECT 
        e.id,
        e.template_id,
        e.slug as short_slug,
        COALESCE(u.name, e.title) as owner_name,
        u.phone as owner_phone,
        e.type as event_type,
        e.event_date::text,
        ea.address_text as event_location,
        ea.lat as event_lat,
        ea.lng as event_lng,
        e.audio_url,
        e.status,
        t.title_kk as template_title,
        ei.content as custom_data
      FROM events e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN templates t ON e.template_id = t.id
      LEFT JOIN event_addresses ea ON ea.event_id = e.id
      LEFT JOIN event_invitations ei ON ei.event_id = e.id
      WHERE e.slug = $1 AND e.status = 'published' AND e.deleted_at IS NULL
      LIMIT 1
    `, [slug]);
    return rows[0] || null;
  }

  async create(data: {
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
  }): Promise<{ id: number; slug: string; templateId?: number; title: string; type: string; eventDate: string }> {
    let targetUserId = data.userId;

    // Optional user upsert by phone
    if (data.ownerPhone) {
      const { rows: userRows } = await query<{ id: string }>(
        `INSERT INTO users (name, phone, auth_provider)
         VALUES ($1, $2, 'phone_otp')
         ON CONFLICT (phone) DO UPDATE SET name = COALESCE(users.name, EXCLUDED.name)
         RETURNING id`,
        [data.ownerName, data.ownerPhone]
      );
      if (userRows[0]) {
        targetUserId = parseInt(userRows[0].id);
      }
    }

    // Insert event
    const { rows: eventRows } = await query<{ id: string }>(
      `INSERT INTO events (user_id, template_id, title, slug, type, event_date, audio_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'published')
       RETURNING id`,
      [
        targetUserId,
        data.templateId || null,
        data.ownerName,
        data.slug,
        data.type,
        data.eventDate,
        data.audioUrl || null,
      ]
    );
    const eventId = parseInt(eventRows[0].id);

    // Insert address
    if (data.location) {
      await query(
        `INSERT INTO event_addresses (event_id, address_text, lat, lng)
         VALUES ($1, $2, $3, $4)`,
        [eventId, data.location, data.lat || null, data.lng || null]
      );
    }

    // Insert invitation custom content canvas
    if (data.customData) {
      await query(
        `INSERT INTO event_invitations (event_id, template_id, content)
         VALUES ($1, $2, $3)`,
        [eventId, data.templateId || null, JSON.stringify(data.customData)]
      );
    }

    return {
      id: eventId,
      slug: data.slug,
      templateId: data.templateId,
      title: data.ownerName,
      type: data.type,
      eventDate: data.eventDate,
    };
  }
}
