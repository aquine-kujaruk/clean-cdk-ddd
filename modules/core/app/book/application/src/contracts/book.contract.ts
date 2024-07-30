import { BookEntity, BookEntityType } from '../../../domain/src/entities/book.entity';
import { CommentEntityType } from '../../../domain/src/entities/comment.entity';

type GetBookWithCommentsResponse = BookEntityType & {
  comments: Omit<CommentEntityType, 'bookId'>[];
};

export interface IBookRepository {
  save(book: BookEntity): Promise<void>;

  getBookWithComments(bookId: string): Promise<GetBookWithCommentsResponse>;

  incrementCommentsCounter(id: string): Promise<void>;
}
