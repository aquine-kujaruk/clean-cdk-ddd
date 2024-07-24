import { IIdentifierRepository } from '@modules/shared/app/application/src/acl/identifier.contract';
import { IEventDispatcherRepository } from '@modules/support/app/event-dispatcher/application/src/acl/event-dispatcher.contract';
import { AppEventValueObject } from '@modules/support/app/event-dispatcher/domain/src/value-objects/app-event.value-object';
import { AppEventSources } from '@modules/support/app/event-dispatcher/infraestructure/app.event-sources';
import { AppEvents } from '@modules/support/app/event-dispatcher/infraestructure/app.events';
import { CommentEntity } from '../../../domain/src/entities/comment.entity';
import { CommentEntitySchema } from '../../../domain/src/schemas/comment.schema';
import { GenerateEntityIdService } from '../../../domain/src/services/generate-entity-id.service';
import { ICommentRepository } from '../acl/comment.contract';

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
