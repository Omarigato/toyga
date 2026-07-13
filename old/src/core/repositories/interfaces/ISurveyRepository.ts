export interface DbGuestSurvey {
  id: number;
  invitation_id: number;
  name: string;
  rsvp_status: 'yes' | 'no' | 'maybe';
  guest_count: number;
  message: string | null;
  created_at: string;
}

export interface ISurveyRepository {
  findByEventId(eventId: number): Promise<DbGuestSurvey[]>;
  create(data: {
    eventId: number;
    name: string;
    status: 'yes' | 'no' | 'maybe';
    guestCount: number;
    message?: string | null;
  }): Promise<boolean>;
}
