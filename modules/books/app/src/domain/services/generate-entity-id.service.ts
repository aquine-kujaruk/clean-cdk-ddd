export class GenerateEntityIdService {
  static getBookId = (id: string): string => `book_${id}`;

  static getCommentId = (id: string): string => `comment_${id}`;
}
