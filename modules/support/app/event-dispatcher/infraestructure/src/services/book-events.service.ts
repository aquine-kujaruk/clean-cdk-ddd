import { BookController } from '@modules/core/app/book/infraestructure/src/controllers/book.controller';
import { AppEvents } from '@modules/support/app/event-dispatcher/infraestructure/app.events';
import { IEventProcessorRepository } from '../../../application/src/acl/event-processor.contract';
import { IEventRepository } from '../../../application/src/acl/event.contract';
import { EventInput } from '../../event-input.type';

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
