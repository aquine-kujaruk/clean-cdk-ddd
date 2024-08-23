import { Book } from '../../domain/entities/book.entity';
import { BookProps } from '../../domain/schemas/book.schema';
import { CommentProps } from '../../domain/schemas/comment.schema';

export type BookComment = Pick<CommentProps, 'summary'> & { commentId: string };

export type BookWithComments = BookProps & {
  comments: BookComment[];
};

export interface IBookRepository {
  save(book: Book): Promise<void>;

  getBookWithComments(bookId: string): Promise<BookWithComments>;

  incrementCommentsCounter(id: string): Promise<void>;
}
