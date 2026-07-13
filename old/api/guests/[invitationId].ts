import type { VercelResponse } from '@vercel/node';
import { withHandler } from '../_core';
import { surveyService } from '../../src/core/factories';
import { z } from 'zod';
import { ValidationError } from '../_core/errors';

export default withHandler(
  async (req, res: VercelResponse) => {
    const { invitationId } = req.query;
    const eventId = z.coerce.number().int().positive().safeParse(invitationId);

    if (!eventId.success) {
      throw new ValidationError('Invalid invitation id parameter.');
    }

    // ─── GET: List Guests/RSVP for Event ─────────────────────────────────────
    if (req.method === 'GET') {
      const surveys = await surveyService.listSurveysForEvent(eventId.data);
      res.status(200).json(surveys);
      return;
    }

    // ─── POST: Submit Guest RSVP Survey ──────────────────────────────────────
    if (req.method === 'POST') {
      const schema = z.object({
        name: z.string().min(1).max(200),
        rsvp_status: z.enum(['yes', 'no', 'maybe']),
        guest_count: z.number().int().min(1).max(20).default(1),
        message: z.string().max(1000).optional().nullable(),
      });

      const body = schema.parse(req.body);

      await surveyService.submitSurvey({
        eventId: eventId.data,
        name: body.name,
        status: body.rsvp_status,
        guestCount: body.guest_count,
        message: body.message,
      });

      res.status(201).json({ success: true });
      return;
    }
  },
  {
    methods: ['GET', 'POST'],
  }
);
