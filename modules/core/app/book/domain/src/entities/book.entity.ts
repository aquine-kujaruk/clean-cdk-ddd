import { generateBookIdentifierWithEntityPrefix } from "../services/generate-book-identifier.service";

export type CreateBookParams = Pick<Book, 'name'>;

export class Book {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly commentsCount: number = 0
  ) {
    this.id = generateBookIdentifierWithEntityPrefix(id)
  }
}
