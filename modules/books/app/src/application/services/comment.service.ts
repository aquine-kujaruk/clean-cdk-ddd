import { IIdentifierRepository } from '@modules/common/app/src/application/contracts/identifier.contract';
import { AppEventSources } from '@modules/event-dispatcher/app/app.event-sources';
import { AppEvents } from '@modules/event-dispatcher/app/app.events';
import { IEventDispatcherRepository } from '@modules/event-dispatcher/app/src/domain/contracts/event-dispatcher.contract';
import { AppEventValueObject } from '@modules/event-dispatcher/app/src/domain/value-objects/app-event.value-object';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentEntitySchema } from '../../domain/schemas/comment.schema';
import { GenerateEntityIdService } from '../../domain/services/generate-entity-id.service';
import { ICommentRepository } from '../contracts/comment.contract';

export class CommentService {
  constructor(
    private readonly identifierRepository: IIdentifierRepository,
    private readonly commentRepository: ICommentRepository,
    private readonly awsEventBridgeRepository: IEventDispatcherRepository
  ) {}

  async createComment(text: string, bookId: string) {
    const identifier = this.identifierRepository.generate();

    const id = GenerateEntityIdService.getCommentId(identifier);
    const comment = new CommentEntity({ id, text, bookId });

    return comment;
  }

  async saveComment(comment: CommentEntity) {
    CommentEntitySchema.parse(comment);

    await this.commentRepository.save(comment);
  }

  sendCommentCreatedEvent(id: string, bookId: string) {
    const message = CommentEntity.getCommentCreatedEventMessage(id, bookId);

    const event = new AppEventValueObject(
      AppEventSources.BOOK_CONTEXT,
      AppEvents.COMMENT_CREATED,
      message
    );

    return this.awsEventBridgeRepository.sendAppEvent(event);
  }
}
