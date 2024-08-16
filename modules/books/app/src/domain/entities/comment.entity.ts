import { BaseEntity } from '@modules/common/app/src/domain/entities/base.entity';
import { CommentEntitySchema, CommentProps } from '../schemas/comment.schema';

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
}
