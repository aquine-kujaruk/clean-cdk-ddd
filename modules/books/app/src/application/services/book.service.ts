import { IIdentifierRepository } from '@modules/common/app/src/application/contracts/identifier.contract';
import { Book } from '../../domain/entities/book.entity';
import { BookEntitySchema } from '../../domain/schemas/book.schema';
import { BookWithComments, IBookRepository } from '../contracts/book.contract';

export class BookService {
  constructor(
    private readonly identifierRepository: IIdentifierRepository,
    private readonly bookRepository: IBookRepository
  ) {}

  createBook(name: string): Book {
    const identifier = this.identifierRepository.generate();

    return Book.create(identifier, { name });
  }

  async saveBook(book: Book): Promise<void> {
    BookEntitySchema.parse(book);

    await this.bookRepository.save(book);
  }

  async getBookWithComments(bookId: string): Promise<BookWithComments> {
    return this.bookRepository.getBookWithComments(bookId);
  }

  async incrementCommentsCounter(bookId: string): Promise<void> {
    await this.bookRepository.incrementCommentsCounter(bookId);
  }
}
