import { BaseController } from '@modules/common/app/src/infraestructure/controllers/base.controller';
import { IdentifierRepository } from '@modules/common/app/src/infraestructure/repositories/identifier.repository';
import { DomainEventsRepository } from '@modules/domain-events-dispatcher/app/src/infraestructure/repositories/domain-events.repository';
import { CommentService } from '../../application/services/comment.service';
import { Comment } from '../../domain/entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';

const identifierRepository = new IdentifierRepository();
const commentRepository = new CommentRepository();
const domainEventsRepository = new DomainEventsRepository();

const commentService = new CommentService(
  identifierRepository,
  commentRepository,
  domainEventsRepository
);

export class CommentController extends BaseController {
  static async createComment({ body, path }: any) {
    return commentService.createComment(path?.bookId, body?.content);
  }

  static async saveComment(input: any) {
    const comment = new Comment(input);

    return commentService.saveComment(comment);
  }

  static async sendCommentCreatedEvent(input: any) {
    const comment = new Comment(input);

    return commentService.sendCommentCreatedEvent(comment);
  }

  static async formatComments({ body, path }: any) {
    return body?.comments.map((content: string) => ({
      bookId: path.bookId,
      content,
    }));
  }
}
