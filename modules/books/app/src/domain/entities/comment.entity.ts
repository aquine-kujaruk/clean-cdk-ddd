import { z } from 'zod';
import { CommentEntitySchema } from '../schemas/comment.schema';

export type CommentEntityType = z.infer<typeof CommentEntitySchema>;

export class CommentEntity {
  public readonly id: string;
  public readonly text: string;
  public readonly bookId: string;

  constructor(props: CommentEntityType) {
    CommentEntitySchema.parse(props);

    this.id = props.id;
    this.text = props.text;
    this.bookId = props.bookId;
  }

  static getCommentCreatedEventMessage(commentId: string, bookId: string) {
    return { commentId, bookId };
  }
}
