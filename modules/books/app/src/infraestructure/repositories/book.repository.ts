import { QueryCommandInput, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { AwsDynamoDbAdapter } from '@modules/common/app/src/infraestructure/adapters/aws-dynamo-db.adapter';
import { IBookRepository } from '../../application/contracts/book.contract';
import { BookEntity } from '../../domain/entities/book.entity';
import { BookEntitySchema } from '../../domain/schemas/book.schema';
import { CommentEntitySchema } from '../../domain/schemas/comment.schema';

export class BookRepository implements IBookRepository {
  async save(book: BookEntity) {
    const Item = {
      PK: `BOOK`,
      SK: `BOOK#${book.id}`,
      id: book.id,
      name: book.name,
      commentsCount: book.commentsCount,
    };

    await AwsDynamoDbAdapter.upsertItem({
      TableName: process.env.BOOK_TABLE_NAME,
      Item,
    });
  }

  async getBookWithComments(bookId: string) {
    const query: QueryCommandInput = {
      TableName: process.env.BOOK_TABLE_NAME,
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
      },
      ExpressionAttributeValues: {
        ':pk': marshall('BOOK'),
        ':sk': marshall(`BOOK#${bookId}`),
      },
    };
    
    const [book, ...commentsJson] = await AwsDynamoDbAdapter.paginatedQuery(query);
    
    return {
      ...BookEntitySchema.parse(book),
      comments: commentsJson.map((comment) => {
        const { id, text } = CommentEntitySchema.parse(comment);

        return { id, text };
      }),
    };
  }

  async incrementCommentsCounter(id: string) {
    const input: UpdateCommandInput = {
      TableName: process.env.BOOK_TABLE_NAME,
      Key: {
        PK: 'BOOK',
        SK: `BOOK#${id}`,
      },
      UpdateExpression: 'SET commentsCount = commentsCount + :inc',
      ExpressionAttributeValues: {
        ':inc': 1,
      },
    };

    await AwsDynamoDbAdapter.updateItem(input);
  }
}
