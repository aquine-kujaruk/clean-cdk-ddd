import { BaseEntity } from '@modules/common/app/src/domain/entities/base.entity';
import { BookEntitySchema, BookProps } from '../schemas/book.schema';
import { GenerateEntityIdService } from '../services/generate-entity-id.service';

export class Book extends BaseEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly commentsCount: number;

  constructor(props: BookProps) {
    super();

    BookEntitySchema.parse(props);

    this.id = props.id;
    this.name = props.name;
    this.commentsCount = props.commentsCount || 0;
  }

  public static create(identifier: string, params: Omit<BookProps, 'id'>): Book {
    const id = GenerateEntityIdService.getBookId(identifier);

    return new Book({ ...params, id });
  }
}
