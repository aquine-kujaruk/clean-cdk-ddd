import { generateBookIdentifierWithEntityPrefix } from '../value-objects/generate-book-identifier';

export class Book {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly timestamp: number
  ) {}

  static fromJson({ name, id, timestamp }: Record<string, any>): Book {
    return new Book(generateBookIdentifierWithEntityPrefix(id), name, timestamp);
  }
}
