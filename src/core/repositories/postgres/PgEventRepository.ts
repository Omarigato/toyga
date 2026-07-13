import type { IEventRepository, DbEvent } from '../interfaces/IEventRepository';
import { query } from '../../../../api/_core';

export class PgEventRepository implements IEventRepository {
  private mapRow(row: any): DbEvent {
    return {
      id: parseInt(row.id),
      user_id: parseInt(row.user_id),
      template_id: row.template_id ? parseInt(row.template_id) : null,
      title: row.title,
      slug: row.slug,
      type: row.type,
      description_html: row.description_html,
      event_date: row.event_date ? new Date(row.event_date).toISOString() : '',
      program: typeof row.program === 'string' ? JSON.parse(row.program) : (row.program || []),
      hashtag: row.hashtag,
      audio_url: row.audio_url,
      video_url: row.video_url,
      status: row.status,
      link_mode: row.link_mode,
      view_count: parseInt(row.view_count || '0'),
      created_at: row.created_at ? new Date(row.created_at).toISOString() : '',
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : '',
      address_text: row.address_text,
      place_name: row.place_name,
      lat: row.lat ? parseFloat(row.lat) : null,
      lng: row.lng ? parseFloat(row.lng) : null,
      map_link: row.map_link,
      template_title: row.template_title,
    };
  }

  async findAll(): Promise<DbEvent[]> {
    const { rows } = await query(`
      SELECT 
        e.*,
        ea.address_text,
        ea.place_name,
        ea.lat,
        ea.lng,
        ea.map_link,
        t.title_kk as template_title
      FROM events e
      LEFT JOIN templates t ON e.template_id = t.id
      LEFT JOIN event_addresses ea ON ea.event_id = e.id
      WHERE e.deleted_at IS NULL
      ORDER BY e.created_at DESC
    `);
    return rows.map((r) => this.mapRow(r));
  }

  async findBySlug(slug: string): Promise<DbEvent | null> {
    const { rows } = await query(`
      SELECT 
        e.*,
        ea.address_text,
        ea.place_name,
        ea.lat,
        ea.lng,
        ea.map_link,
        t.title_kk as template_title
      FROM events e
      LEFT JOIN templates t ON e.template_id = t.id
      LEFT JOIN event_addresses ea ON ea.event_id = e.id
      WHERE e.slug = $1 AND e.deleted_at IS NULL
      LIMIT 1
    `, [slug]);
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async findById(id: number): Promise<DbEvent | null> {
    const { rows } = await query(`
      SELECT 
        e.*,
        ea.address_text,
        ea.place_name,
        ea.lat,
        ea.lng,
        ea.map_link,
        t.title_kk as template_title
      FROM events e
      LEFT JOIN templates t ON e.template_id = t.id
      LEFT JOIN event_addresses ea ON ea.event_id = e.id
      WHERE e.id = $1 AND e.deleted_at IS NULL
      LIMIT 1
    `, [id]);
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async create(data: {
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
    // Insert event
    const { rows: eventRows } = await query(
      `INSERT INTO events (
        user_id, template_id, title, slug, type, description_html, 
        event_date, program, hashtag, audio_url, video_url, link_mode, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'draft')
      RETURNING id`,
      [
        data.userId,
        data.templateId || null,
        data.title,
        data.slug,
        data.type,
        data.descriptionHtml || null,
        data.eventDate,
        JSON.stringify(data.program || []),
        data.hashtag || null,
        data.audioUrl || null,
        data.videoUrl || null,
        data.linkMode || 'shared',
      ]
    );

    const eventId = parseInt(eventRows[0].id);

    // Insert address if provided
    if (data.address) {
      await query(
        `INSERT INTO event_addresses (event_id, address_text, place_name, lat, lng, map_link)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          eventId,
          data.address.address_text,
          data.address.place_name || null,
          data.address.lat || null,
          data.address.lng || null,
          data.address.map_link || null,
        ]
      );
    }

    const created = await this.findById(eventId);
    if (!created) {
      throw new Error('Failed to retrieve created event');
    }
    return created;
  }

  async update(id: number, data: {
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
    const setFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const addField = (colName: string, value: any) => {
      if (value !== undefined) {
        setFields.push(`${colName} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    };

    addField('template_id', data.templateId);
    addField('title', data.title);
    addField('type', data.type);
    addField('description_html', data.descriptionHtml);
    addField('event_date', data.eventDate);
    if (data.program !== undefined) {
      addField('program', JSON.stringify(data.program));
    }
    addField('hashtag', data.hashtag);
    addField('audio_url', data.audioUrl);
    addField('video_url', data.videoUrl);
    addField('link_mode', data.linkMode);
    addField('status', data.status);

    if (setFields.length > 0) {
      values.push(id);
      await query(
        `UPDATE events SET ${setFields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex}`,
        values
      );
    }

    // Handle address update/insert
    if (data.address !== undefined) {
      if (data.address === null) {
        await query('DELETE FROM event_addresses WHERE event_id = $1', [id]);
      } else {
        const { rows: addrRows } = await query('SELECT id FROM event_addresses WHERE event_id = $1', [id]);
        if (addrRows.length > 0) {
          await query(
            `UPDATE event_addresses SET 
              address_text = $1, place_name = $2, lat = $3, lng = $4, map_link = $5, updated_at = NOW()
             WHERE event_id = $6`,
            [
              data.address.address_text,
              data.address.place_name || null,
              data.address.lat || null,
              data.address.lng || null,
              data.address.map_link || null,
              id,
            ]
          );
        } else {
          await query(
            `INSERT INTO event_addresses (event_id, address_text, place_name, lat, lng, map_link)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              id,
              data.address.address_text,
              data.address.place_name || null,
              data.address.lat || null,
              data.address.lng || null,
              data.address.map_link || null,
            ]
          );
        }
      }
    }

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to retrieve updated event');
    }
    return updated;
  }
}
