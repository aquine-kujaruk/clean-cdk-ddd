import { Comment } from '@modules/books/app/src/domain/entities/comment.entity';
import { BookController } from '@modules/books/app/src/infraestructure/controllers/book.controller';
import {
  DomainEventBody,
  HandlerConsumer,
  BaseDomainEvent,
  UseCaseConsumer,
} from '@modules/common/app/src/domain/events/base.domain-event';
import { DomainEventSources } from '../../../../domain-event.sources';

export type CommentCreatedEventMessage = Partial<{
  commentId: string;
  bookId: string;
}>;

export class CommentCretedEvent
  implements BaseDomainEvent<DomainEventSources, CommentCreatedEventMessage>
{
  public static type = 'COMMENT_CREATED';

  public readonly compositeIdKeys = ['commentId'];
  public message: CommentCreatedEventMessage;

  constructor(comment: Comment | undefined) {
    this.message = {
      commentId: comment?.id,
      bookId: comment?.bookId,
    };
  }

  public create(index: string): DomainEventBody<DomainEventSources> {
    return {
      eventSource: DomainEventSources.BOOK_MODULE,
      eventType: CommentCretedEvent.type,
      detail: {
        index,
        message: this.message,
      },
    };
  }

  public methodConsumers(): HandlerConsumer[] {
    return [
      new HandlerConsumer(
        process.env.BOOK_HANDLER as string,
        BookController,
        BookController.incrementCommentsCounter.name
      ),
    ];
  }

  public useCaseConsumers(): UseCaseConsumer[] {
    return [];
  }
}
