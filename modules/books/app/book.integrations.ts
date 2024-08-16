import { marshall } from '@aws-sdk/util-dynamodb';
import { AppRequestType } from '@modules/apis/app/api.requests';
import {
  DynamoDbIntegration,
  LambdaFunctionIntegration,
  StateMachineIntegration,
} from '@modules/common/app/lib/construct-utils/rest-apis/integrations';
import { RestApiAppControllersType } from '@modules/common/app/lib/construct-utils/rest-apis/rest-api.types';
import { BookTable } from '@modules/common/app/lib/resources/databases/dynamo-db/book.table';
import { BookCommands } from './book.commands';
import { BookQueries } from './book.queries';
import { BookLambda } from './lib/book.lambda';
import { AddCommentStateMachine } from './lib/state-machines/add-comment.state-machine';
import { CreateBookStateMachine } from './lib/state-machines/create-book.state-machine';
import { BookController } from './src/infraestructure/controllers/book.controller';

export const BookApiIntegrations: RestApiAppControllersType<AppRequestType> = {
  [BookCommands.CREATE_BOOK]: StateMachineIntegration({ target: CreateBookStateMachine }),
  [BookCommands.ADD_COMMENT]: StateMachineIntegration({ target: AddCommentStateMachine }),

  // [BookEvents.BOOK_VERIFIED]: EventBusIntegration({
  //   target: DomainEventsBus,
  //   eventType: BookEvents.BOOK_VERIFIED,
  // }),

  [BookQueries.GET_BOOK]: DynamoDbIntegration({
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

  [BookQueries.GET_BOOK_AND_COMMENTS]: LambdaFunctionIntegration({
    target: BookLambda,
    // authorizerFunction: ApiAuthorizersInfraestructureLambda,
    handlerProps: {
      controller: BookController,
      methodName: BookController.getBookWithComments.name,
    },
  }),
};
