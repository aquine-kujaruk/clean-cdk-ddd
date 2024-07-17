import { Book } from '../entities/book.entity';

export interface BookRepository {
  save(book: Book): Promise<void>;
}
