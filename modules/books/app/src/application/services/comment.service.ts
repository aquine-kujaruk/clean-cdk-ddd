import { IIdentifierRepository } from '@modules/common/app/src/application/contracts/identifier.contract';
import { IDomainEventsRepository } from '@modules/domain-events-dispatcher/app/src/domain/contracts/domain-events.contract';
import { CommentCretedEvent } from '@modules/domain-events-dispatcher/app/src/domain/domain-events/book/comment-created.event';
import { Comment } from '../../domain/entities/comment.entity';
import { CommentEntitySchema } from '../../domain/schemas/comment.schema';
import { GenerateEntityIdService } from '../../domain/services/generate-entity-id.service';
import { truncateText } from '../../domain/services/truncate-text.service';
import { ICommentRepository } from '../contracts/comment.contract';

export class CommentService {
  constructor(
    private readonly identifierRepository: IIdentifierRepository,
    private readonly commentRepository: ICommentRepository,
    private readonly awsEventBridgeRepository: IDomainEventsRepository
  ) {}

  async createComment(bookId: string, content: string) {
    const identifier = this.identifierRepository.generate();

    const id = GenerateEntityIdService.getCommentId(identifier);
    const summary = truncateText(content, 10, true);

    const comment = new Comment({ id, bookId, content, summary });

    return comment;
  }

  async saveComment(comment: Comment) {
    CommentEntitySchema.parse(comment);

    await this.commentRepository.save(comment);
  }

  sendCommentCreatedEvent(comment: Comment) {
    const eventInstance = new CommentCretedEvent(comment);

    return this.awsEventBridgeRepository.sendAppEvent(eventInstance);
  }
}
