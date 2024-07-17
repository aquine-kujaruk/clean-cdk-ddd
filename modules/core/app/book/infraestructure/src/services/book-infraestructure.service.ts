import { BaseService } from '@modules/shared/app/src/infraestructure/services/base.service';
import { Book } from '../../../domain/src/entities/book.entity';
import { DayJsRepository } from '../repositories/day-js.repository';
import { BookDbRepository } from '../repositories/book-db.repository';
import { UuidRepository } from '../repositories/uuid.repository';

export class BookInfraestructureService extends BaseService {
  static getTimestamp() {
    const dayJsRepository = new DayJsRepository();

    return dayJsRepository.getTimestamp();
  }

  static generateUuid() {
    const uuidRepository = new UuidRepository();

    return uuidRepository.generate();
  }

  static saveBook(book: Book) {
    const bookDbRepository = new BookDbRepository();

    return bookDbRepository.save(book);
  }
}
