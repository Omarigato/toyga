import type { ISurveyRepository, DbGuestSurvey } from '../interfaces/ISurveyRepository';
import { query } from '../../../../api/_core/db';

export class PgSurveyRepository implements ISurveyRepository {
  async findByEventId(eventId: number): Promise<DbGuestSurvey[]> {
    const { rows } = await query<DbGuestSurvey>(`
      SELECT 
        s.id,
        s.event_id as invitation_id,
        s.name,
        s.status as rsvp_status,
        COALESCE((SELECT COUNT(*) FROM survey_guests sg WHERE sg.survey_id = s.id), 0) + 1 as guest_count,
        s.message,
        s.created_at
      FROM surveys s
      WHERE s.event_id = $1 AND s.deleted_at IS NULL
      ORDER BY s.created_at DESC
    `, [eventId]);
    return rows;
  }

  async create(data: {
    eventId: number;
    name: string;
    status: 'yes' | 'no' | 'maybe';
    guestCount: number;
    message?: string | null;
  }): Promise<boolean> {
    const { rows } = await query<{ id: string }>(
      `INSERT INTO surveys (event_id, name, status, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [data.eventId, data.name, data.status, data.message || null]
    );

    const surveyId = parseInt(rows[0].id);

    if (data.guestCount > 1) {
      const additionalCount = data.guestCount - 1;
      for (let i = 0; i < additionalCount; i++) {
        await query(
          `INSERT INTO survey_guests (survey_id, name)
           VALUES ($1, $2)`,
          [surveyId, `Guest ${i + 1} of ${data.name}`]
        );
      }
    }

    return true;
  }
}
