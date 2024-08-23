import { BaseEntity } from '@modules/common/app/src/domain/entities/base.entity';
import { CommentCretedEvent } from '@modules/domain-events-dispatcher/app/src/domain/domain-events/book/comment-created.event';
import { CommentEntitySchema, CommentProps } from '../schemas/comment.schema';
import { GenerateEntityIdService } from '../services/generate-entity-id.service';
import { truncateText } from '../services/truncate-text.service';

export class Comment extends BaseEntity {
  public readonly id: string;
  public readonly content: string;
  public readonly bookId: string;
  public readonly summary: string;

  constructor(props: CommentProps) {
    super();

    CommentEntitySchema.parse(props);

    this.id = props.id;
    this.bookId = props.bookId;
    this.content = props.content;
    this.summary = props.summary;
  }

  public static create(identifier: string, params: Omit<CommentProps, 'id' | 'summary'>): Comment {
    const id = GenerateEntityIdService.getCommentId(identifier);
    const summary = truncateText(params.content, 30, true);

    return new Comment({ ...params, id, summary });
  }

  public get commentCreatedEvent(): CommentCretedEvent {
    return new CommentCretedEvent(this);
  }
}
