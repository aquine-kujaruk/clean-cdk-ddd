import { z } from 'zod';
import { BookEntitySchema } from '../schemas/book.schema';

export type BookEntityType = z.infer<typeof BookEntitySchema>;

export class BookEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly commentsCount: number;

  constructor(props: BookEntityType) {
    BookEntitySchema.parse(props);

    this.id = props.id;
    this.name = props.name;
    this.commentsCount = props.commentsCount || 0;
  }
}
