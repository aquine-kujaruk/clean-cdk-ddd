import { UuidRepository } from '@modules/shared/app/src/infraestructure/repositories/uuid.repository';
import { BaseService } from '@modules/shared/app/src/infraestructure/services/base.service';
import { AppEventValueObject } from '@modules/support/app/event-dispatcher/domain/value-objects/app-event.value-object';
import { AppEventSources } from '@modules/support/app/event-dispatcher/infraestructure/app.event-sources';
import { AppEvents } from '@modules/support/app/event-dispatcher/infraestructure/app.events';
import { AwsEventBridgeRepository } from '@modules/support/app/event-dispatcher/infraestructure/src/repositories/aws-event-bridge.repository';
import { Comment, CreateCommentParams } from '../../../domain/src/entities/comment.entity';
import { CommentDbRepository } from '../../../infraestructure/src/repositories/comment-db.repository';

export class CommentService extends BaseService {

  static async createComment({ text, bookId }: CreateCommentParams) {
    const uuidRepository = new UuidRepository();

    const id = uuidRepository.generate();

    const comment = new Comment(id, text, bookId);

    return comment;
  }

  static async saveComment(comment: Comment) {
    const commentDbRepository = new CommentDbRepository();
    await commentDbRepository.save(comment);
  }

  static sendCommentCreatedEvent(comment: Comment) {
    const message = Comment.createCommentCreatedEventMessage(comment);

    const event = new AppEventValueObject(
      AppEventSources.STEP_FUNCTIONS,
      AppEvents.COMMENT_CREATED,
      message
    );

    const awsEventBridgeRepository = new AwsEventBridgeRepository();
    return awsEventBridgeRepository.sendAppEvent(event);
  }
}
