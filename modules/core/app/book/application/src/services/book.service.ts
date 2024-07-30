import { IIdentifierRepository } from '@modules/shared/app/application/src/contracts/identifier.contract';
import { BookEntity } from '../../../domain/src/entities/book.entity';
import { BookEntitySchema } from '../../../domain/src/schemas/book.schema';
import { GenerateEntityIdService } from '../../../domain/src/services/generate-entity-id.service';
import { IBookRepository } from '../contracts/book.contract';

export class BookService {
  constructor(
    private readonly identifierRepository: IIdentifierRepository,
    private readonly bookRepository: IBookRepository
  ) {}

  async createBook(name: string) {
    const identifier = this.identifierRepository.generate();

    const id = GenerateEntityIdService.getBookId(identifier);
    const book = new BookEntity({ id, name });

    return book;
  }

  async saveBook(book: BookEntity) {
    BookEntitySchema.parse(book);

    await this.bookRepository.save(book);
  }

  async getBookWithComments(bookId: string) {
    return this.bookRepository.getBookWithComments(bookId);
  }

  async incrementCommentsCounter(bookId: string) {
    return this.bookRepository.incrementCommentsCounter(bookId);
  }
}
