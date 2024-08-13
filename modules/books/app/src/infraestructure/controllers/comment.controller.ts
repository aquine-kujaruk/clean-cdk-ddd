import { IdentifierRepository } from '@modules/common/app/src/infraestructure/repositories/identifier.repository';
import { CommentService } from '../../application/services/comment.service';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';
import { EventDispatcherRepository } from '@modules/event-dispatcher/app/src/infraestructure/repositories/event-dispatcher.repository';
import { BaseController } from '@modules/common/app/src/infraestructure/controllers/base.controller';

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
