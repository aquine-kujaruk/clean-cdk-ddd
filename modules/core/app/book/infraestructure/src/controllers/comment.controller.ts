import { BaseController } from '@modules/shared/app/infraestructure/src/controllers/base.controller';
import { IdentifierRepository } from '@modules/shared/app/infraestructure/src/repositories/identifier.repository';
import { EventDispatcherRepository } from '@modules/support/app/event-dispatcher/infraestructure/src/repositories/event-dispatcher.repository';
import { CommentService } from '../../../application/src/services/comment.service';
import { CommentEntity } from '../../../domain/src/entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';

const identifierRepository = new IdentifierRepository();
const commentRepository = new CommentRepository();
const awsEventBridgeRepository = new EventDispatcherRepository();

const commentService = new CommentService(
  identifierRepository,
  commentRepository,
  awsEventBridgeRepository
);

export class CommentController extends BaseController {
  static async createComment(input: any) {
    const { text, bookId } = input;

    return commentService.createComment(text, bookId);
  }

  static async saveComment(input: any) {
    const comment = new CommentEntity(input);

    return commentService.saveComment(comment);
  }

  static async sendCommentCreatedEvent(input: any) {
    const { id, bookId } = input;

    return commentService.sendCommentCreatedEvent(id, bookId);
  }
}
