import { generateCommentIdentifierWithEntityPrefix } from '../services/generate-comment-identifier.service';

export type CreateCommentParams = Pick<Comment, 'text' | 'bookId'>;

export class Comment {
  constructor(
    public readonly id: string,
    public readonly text: string,
    public readonly bookId: string
  ) {
    this.id = generateCommentIdentifierWithEntityPrefix(id);
  }

  static createCommentCreatedEventMessage(comment: Comment) {
    return { commentId: comment.id };
  }
}
