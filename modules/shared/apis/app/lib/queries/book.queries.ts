import { marshall } from '@aws-sdk/util-dynamodb';
import { BookLambda } from '@modules/books/app/lib/book.lambda';
import { BookController } from '@modules/books/app/src/infraestructure/controllers/book.controller';
import {
  DynamoDbIntegration,
  LambdaFunctionIntegration,
} from '@modules/common/app/lib/construct-utils/rest-api-integrations';
import { CommandQueryType } from '@modules/common/app/lib/construct-utils/types/rest-api.types';
import { BookTable } from '@modules/common/app/lib/resources/databases/dynamo-db/book.table';
import { PublicApi } from '../apis/public.api';

export const BookQueries: CommandQueryType = {
  resource: 'book',
  endpointDefinitions: [
    {
      path: 'GET /get-book/{bookId}',
      apis: [PublicApi],
      integration: DynamoDbIntegration({
        target: BookTable,
        query: {
          KeyConditionExpression: '#pk = :pk AND #sk = :sk',
          ExpressionAttributeNames: {
            '#pk': 'PK',
            '#sk': 'SK',
            '#name': 'name',
          },
          ExpressionAttributeValues: marshall({
            ':pk': "BOOK#$input.params('bookId')",
            ':sk': 'METADATA',
          }),
          ProjectionExpression: 'id, #name, commentsCount, createdAtUTC, updatedAtUTC',
        },
        selectedFields: {
          id: '$field.id.S',
          name: '$field.name.S',
          commentsCount: '$field.commentsCount.N',
          createdAtUTC: '$field.createdAtUTC.S',
          updatedAtUTC: '$field.updatedAtUTC.S',
        },
      }),
    },
    {
      path: 'GET /get-books-and-comments/{bookId}',
      apis: [PublicApi],
      integration: LambdaFunctionIntegration({
        target: BookLambda,
        handlerProps: {
          controller: BookController,
          methodName: BookController.getBookWithComments.name,
        },
      }),
    },
  ],
};
