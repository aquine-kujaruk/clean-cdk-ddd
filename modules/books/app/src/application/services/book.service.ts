import { IIdentifierRepository } from '@modules/common/app/src/application/contracts/identifier.contract';
import { Book } from '../../domain/entities/book.entity';
import { BookEntitySchema } from '../../domain/schemas/book.schema';
import { BookWithComments, IBookRepository } from '../contracts/book.contract';

export class BookService {
  constructor(
    private readonly identifierRepository: IIdentifierRepository,
    private readonly bookRepository: IBookRepository
  ) {}

  async fetchBookAuthor(name: string): Promise<{ author: string }> {
    return this.bookRepository.fetchBookAuthor(name);
  }

  async fetchBookDescription(name: string): Promise<{ description: string }> {
    return this.bookRepository.fetchBookDescription(name);
  }

  createBook(name: string, author: string, description: string): Book {
    const identifier = this.identifierRepository.generate();

    return Book.create(identifier, { name, author, description });
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
