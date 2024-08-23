import { IIdentifierRepository } from '@modules/common/app/src/application/contracts/identifier.contract';
import { IDomainEventsRepository } from '@modules/domain-events-dispatcher/app/src/application/contracts/domain-events.contract';
import { Comment } from '../../domain/entities/comment.entity';
import { CommentEntitySchema } from '../../domain/schemas/comment.schema';
import { ICommentRepository } from '../contracts/comment.contract';

export class CommentService {
  constructor(
    private readonly identifierRepository: IIdentifierRepository,
    private readonly commentRepository: ICommentRepository,
    private readonly domainEventsRepository: IDomainEventsRepository
  ) {}

  createComment(bookId: string, content: string): Comment {
    const identifier = this.identifierRepository.generate();

    return Comment.create(identifier, { bookId, content });
  }

  async saveComment(comment: Comment): Promise<void> {
    CommentEntitySchema.parse(comment);

    await this.commentRepository.save(comment);
  }

  async sendCommentCreatedEvent(comment: Comment): Promise<void> {
    const { commentCreatedEvent } = comment;

    await this.domainEventsRepository.sendAppEvent(commentCreatedEvent);
  }
}
