import { BaseController } from '@modules/common/app/src/infraestructure/controllers/base.controller';
import { IdentifierRepository } from '@modules/common/app/src/infraestructure/repositories/identifier.repository';
import { BookService } from '../../application/services/book.service';
import { Book } from '../../domain/entities/book.entity';
import { BookRepository } from '../repositories/book.repository';

const identifierRepository = new IdentifierRepository();
const bookRepository = new BookRepository();

const bookService = new BookService(identifierRepository, bookRepository);

export class BookController extends BaseController {
  static async createBook(input: any) {
    const name = input?.name;
    const response = await bookService.createBook(name);

    return response;
  }

  static async saveBook(input: any) {
    const book = new Book(input);
    const response = await bookService.saveBook(book);

    return response;
  }

  static async getBookWithComments(input: any) {
    const id = input?.path?.bookId;
    const response = await bookService.getBookWithComments(id);

    return response;
  }

  static async incrementCommentsCounter(input: any) {
    const bookId = input?.bookId;
    const response = await bookService.incrementCommentsCounter(bookId);

    return response;
  }
}
