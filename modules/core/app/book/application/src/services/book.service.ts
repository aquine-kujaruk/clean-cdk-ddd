import { UuidRepository } from '@modules/shared/app/src/infraestructure/repositories/uuid.repository';
import { BaseService } from '@modules/shared/app/src/infraestructure/services/base.service';
import { Book, CreateBookParams } from '../../../domain/src/entities/book.entity';
import { BookDbRepository } from '../../../infraestructure/src/repositories/book-db.repository';

export class BookService extends BaseService {
  static async createBook({ name }: CreateBookParams) {
    const uuidRepository = new UuidRepository();

    const id = uuidRepository.generate();

    const book = new Book(id, name);

    return book;
  }

  static async saveBook(book: Book) {
    const bookDbRepository = new BookDbRepository();
    await bookDbRepository.save(book);
  }
}
