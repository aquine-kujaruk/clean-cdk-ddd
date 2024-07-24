import { BookEvents } from '@modules/core/app/book/infraestructure/book.events';
import { BaseController } from '@modules/shared/app/infraestructure/src/controllers/base.controller';
import { EventProcessorRepository } from '../repositories/event-processor.repository';
import { EventRepository } from '../repositories/event.repository';
import { BookEventsService } from '../services/book-events.service';

const eventRepository = new EventRepository();
const eventProcessorRepository = new EventProcessorRepository();

const bookEventsService = new BookEventsService(eventRepository, eventProcessorRepository);

export class BookEventsController extends BaseController {
  static async [BookEvents.COMMENT_CREATED](input: any) {
    const response = await bookEventsService.processCommentCreated(
      input,
      process.env.BOOK_LAMBDA_NAME as string
    );

    return response;
  }
}