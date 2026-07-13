import type { ISurveyRepository, DbGuestSurvey } from '../repositories/interfaces/ISurveyRepository';

export class SurveyService {
  constructor(private surveyRepo: ISurveyRepository) {}

  async listSurveysForEvent(eventId: number): Promise<DbGuestSurvey[]> {
    return this.surveyRepo.findByEventId(eventId);
  }

  async submitSurvey(data: {
    eventId: number;
    name: string;
    status: 'yes' | 'no' | 'maybe';
    guestCount: number;
    message?: string | null;
  }): Promise<boolean> {
    return this.surveyRepo.create(data);
  }
}
