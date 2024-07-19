import { AwsDynamoDbAdapter } from '@modules/shared/app/src/infraestructure/adapters/aws-dynamo-db.adapter';
import { Book } from '../../../domain/src/entities/book.entity';
import { BookRepository } from '../../../domain/src/contracts/book.repository';

export class BookDbRepository implements BookRepository {
  async save(book: Book) {
    const Item = {
      PK: `BOOK`,
      SK: `BOOK#${book.id}`,
      name: book.name,
      commentsCount: book.commentsCount,
    };

    await AwsDynamoDbAdapter.upsertItem({
      TableName: process.env.BOOK_TABLE_NAME,
      Item,
    });
  }
}
