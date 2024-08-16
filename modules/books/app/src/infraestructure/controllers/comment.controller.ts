import { BaseController } from '@modules/common/app/src/infraestructure/controllers/base.controller';
import { IdentifierRepository } from '@modules/common/app/src/infraestructure/repositories/identifier.repository';
import { DomainEventsRepository } from '@modules/domain-events-dispatcher/app/src/infraestructure/repositories/domain-events.repository';
import { CommentService } from '../../application/services/comment.service';
import { Comment } from '../../domain/entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';

const identifierRepository = new IdentifierRepository();
const commentRepository = new CommentRepository();
const awsEventBridgeRepository = new DomainEventsRepository();

const commentService = new CommentService(
  identifierRepository,
  commentRepository,
  awsEventBridgeRepository
);

export class CommentController extends BaseController {
  static async createComment(input: any) {
    const { bookId, content } = input;

    return commentService.createComment(bookId, content);
  }

  static async saveComment(input: any) {
    const comment = new Comment(input);

    return commentService.saveComment(comment);
  }

  static async sendCommentCreatedEvent(input: any) {
    const comment = new Comment(input);

    return commentService.sendCommentCreatedEvent(comment);
  }
}
