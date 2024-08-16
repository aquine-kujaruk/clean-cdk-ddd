import { BaseEntity } from '@modules/common/app/src/domain/entities/base.entity';
import { BookProps, BookEntitySchema } from '../schemas/book.schema';

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
}
