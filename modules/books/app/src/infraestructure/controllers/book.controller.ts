import { BaseController } from '@modules/common/app/src/infraestructure/controllers/base.controller';
import { IdentifierRepository } from '@modules/common/app/src/infraestructure/repositories/identifier.repository';
import { BookService } from '../../application/services/book.service';
import { Book } from '../../domain/entities/book.entity';
import { BookRepository } from '../repositories/book.repository';

const identifierRepository = new IdentifierRepository();
const bookRepository = new BookRepository();

const bookService = new BookService(identifierRepository, bookRepository);

export class BookController extends BaseController {
  static async fetchBookAuthor({ body }: any) {
    return bookService.fetchBookAuthor(body.name);
  }

  static async fetchBookDescription({ body }: any) {
    return bookService.fetchBookDescription(body.name);
  }

  static async createBook({ name, author, description }: any) {
    return bookService.createBook(name, author, description);
  }

  static async saveBook(input: any) {
    const book = new Book(input);

    return bookService.saveBook(book);
  }

  static async getBookWithComments({ path }: any) {
    return bookService.getBookWithComments(path?.bookId);
  }

  static async incrementCommentsCounter({ bookId }: any) {
    return bookService.incrementCommentsCounter(bookId);
  }
}
