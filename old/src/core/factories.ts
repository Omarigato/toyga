import { PgCategoryRepository } from './repositories/postgres/PgCategoryRepository';
import { PgTemplateRepository } from './repositories/postgres/PgTemplateRepository';
import { PgEventRepository } from './repositories/postgres/PgEventRepository';
import { PgSurveyRepository } from './repositories/postgres/PgSurveyRepository';
import { CategoryService } from './services/CategoryService';
import { TemplateService } from './services/TemplateService';
import { EventService } from './services/EventService';
import { SurveyService } from './services/SurveyService';

// Repositories Singletons
const categoryRepository = new PgCategoryRepository();
const templateRepository = new PgTemplateRepository();
const eventRepository = new PgEventRepository();
const surveyRepository = new PgSurveyRepository();

// Domain Services Singletons (Manual DI)
export const categoryService = new CategoryService(categoryRepository);
export const templateService = new TemplateService(templateRepository);
export const eventService = new EventService(eventRepository);
export const surveyService = new SurveyService(surveyRepository);
