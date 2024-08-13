import { BookController } from '@modules/books/app/src/infraestructure/controllers/book.controller';
import { AppEvents } from '../../../app.events';
import { EventInput } from '../../../event-input.type';
import { IEventProcessorRepository } from '../../domain/contracts/event-processor.contract';
import { IEventRepository } from '../../domain/contracts/event.contract';

export class BookEventsService {
  constructor(
    private eventRepository: IEventRepository,
    private eventProcessorRepository: IEventProcessorRepository
  ) {}

  async processCommentCreated(input: EventInput<typeof AppEvents>, target: string) {
    const referenceKeys = ['commentId'];

    await this.eventRepository.saveEventIfUnique(input, referenceKeys);

    await this.eventProcessorRepository.invokeHandler(target, {
      input: input.detail.message,
      controller: BookController,
      methodName: BookController.incrementCommentsCounter.name,
    });
  }
}
