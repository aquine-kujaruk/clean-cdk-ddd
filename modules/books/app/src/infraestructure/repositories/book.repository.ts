import { QueryCommandInput, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { AwsDynamoDbAdapter } from '@modules/common/app/src/infraestructure/adapters/aws-dynamo-db.adapter';
import { AxiosAdapter } from '@modules/common/app/src/infraestructure/adapters/axios.adapter';
import { BookComment, IBookRepository } from '../../application/contracts/book.contract';
import { Book } from '../../domain/entities/book.entity';
import { BookEntitySchema } from '../../domain/schemas/book.schema';

const TableName = process.env.BOOK_TABLE_NAME;

export class BookRepository implements IBookRepository {
  async fetchBookAuthor(name: string) {
    const { data } = await AxiosAdapter.get(`https://freetestapi.com/api/v1/books?search=${name}`);
    console.log('fetchBookAuthor: ', data);

    return { author: data[0]?.author };
  }

  async fetchBookDescription(name: string) {
    const { data } = await AxiosAdapter.get(`https://freetestapi.com/api/v1/books?search=${name}`);
    console.log('fetchBookDescription: ', data);

    return { description: data[0]?.description };
  }

  async save(book: Book) {
    await AwsDynamoDbAdapter.upsertItem({
      TableName,
      Item: {
        PK: `BOOK#${book.id}`,
        SK: 'METADATA',
        ENTITIES: [Book],
        ...book,
      },
    });
  }

  async getBookWithComments(bookId: string) {
    const bookEntityQuery: QueryCommandInput = {
      TableName,
      KeyConditionExpression: '#pk = :pk and #sk = :sk',
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
        '#name': 'name',
      },
      ExpressionAttributeValues: marshall({
        ':pk': `BOOK#${bookId}`,
        ':sk': 'METADATA',
      }),
      ProjectionExpression: 'id, #name, commentsCount, createdAtUTC, updatedAtUTC',
    };

    const commentRelationsQuery: QueryCommandInput = {
      TableName,
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
      },
      ExpressionAttributeValues: marshall({
        ':pk': `BOOK#${bookId}`,
        ':sk': 'COMMENT#',
      }),
      ProjectionExpression: 'commentId, summary, createdAtUTC, updatedAtUTC',
    };

    const response = await Promise.all([
      AwsDynamoDbAdapter.paginatedQuery(bookEntityQuery),
      AwsDynamoDbAdapter.paginatedQuery(commentRelationsQuery),
    ]);

    const [[book], comments] = response;

    return {
      ...BookEntitySchema.parse(book),
      comments: comments as BookComment[],
    };
  }

  async incrementCommentsCounter(id: string) {
    const input: UpdateCommandInput = {
      TableName,
      Key: {
        PK: `BOOK#${id}`,
        SK: 'METADATA',
      },
      UpdateExpression: 'SET commentsCount = commentsCount + :inc',
      ExpressionAttributeValues: {
        ':inc': 1,
      },
    };

    await AwsDynamoDbAdapter.updateItem(input);
  }
}
