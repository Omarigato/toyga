import type { VercelResponse } from '@vercel/node';
import { withHandler, authenticateUser, authenticateAdmin } from '../_core';
import { eventService } from '../../src/core/factories';
import { updateEventSchema } from '../../src/core/validation/events';
import { ValidationError, ForbiddenError, UnauthorizedError } from '../_core/errors';
import type { RequestContext } from '../_core/types';

export default withHandler(
  async (req, res: VercelResponse) => {
    const { slug } = req.query;
    if (!slug || typeof slug !== 'string') {
      throw new ValidationError('Slug or ID is required');
    }

    const isId = /^\d+$/.test(slug);

    // Manually resolve authentication context if present
    let authContext: RequestContext | null = null;
    try {
      authContext = authenticateAdmin(req);
    } catch {
      try {
        authContext = authenticateUser(req);
      } catch {
        // No valid token, keep authContext as null
      }
    }

    // ─── GET: Fetch Event ────────────────────────────────────────────────────
    if (req.method === 'GET') {
      if (isId) {
        // Lookup by event ID
        if (!authContext) {
          throw new UnauthorizedError('Authentication required to view by ID');
        }

        const eventId = parseInt(slug);
        const event = await eventService.getEventById(eventId);

        if (authContext.role !== 'admin' && event.user_id !== authContext.userId) {
          throw new ForbiddenError('You do not own this event');
        }

        res.status(200).json(event);
        return;
      } else {
        // Public slug lookup
        const event = await eventService.getEventBySlug(slug);
        res.status(200).json(event);
        return;
      }
    }

    // ─── PUT: Update Event ───────────────────────────────────────────────────
    if (req.method === 'PUT') {
      if (!authContext) {
        throw new UnauthorizedError('Authentication required');
      }

      if (!isId) {
        throw new ValidationError('Event ID is required for updates');
      }

      const eventId = parseInt(slug);
      const event = await eventService.getEventById(eventId);

      if (authContext.role !== 'admin' && event.user_id !== authContext.userId) {
        throw new ForbiddenError('You do not own this event');
      }

      const body = updateEventSchema.parse(req.body);

      const updated = await eventService.updateEvent(eventId, {
        templateId: body.template_id,
        title: body.title,
        type: body.type,
        descriptionHtml: body.description_html,
        eventDate: body.event_date,
        program: body.program,
        hashtag: body.hashtag,
        audioUrl: body.audio_url,
        videoUrl: body.video_url,
        linkMode: body.link_mode,
        address: body.address,
      });

      res.status(200).json(updated);
      return;
    }
  },
  {
    methods: ['GET', 'PUT'],
  }
);
