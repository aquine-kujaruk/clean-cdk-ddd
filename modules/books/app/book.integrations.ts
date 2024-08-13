import { AppRequestType } from '@modules/apis/app/api.requests';
import { RestApiIntegration } from '@modules/common/app/lib/construct-utils/rest-apis/integration';
import { RestApiAppControllersType } from '@modules/common/app/lib/construct-utils/rest-apis/rest-api.types';
import { BookTable } from '@modules/common/app/lib/stateful-resources/databases/dynamo-db/book.table';
import { AppEventsBus } from '@modules/event-dispatcher/app/lib/app-events.bus';
import { BookCommands } from './book.commands';
import { BookEvents } from './book.events';
import { BookQueries } from './book.queries';
import { BookLambda } from './lib/book.lambda';
import { AddCommentStateMachine } from './lib/state-machines/add-comment.state-machine';
import { CreateBookStateMachine } from './lib/state-machines/create-book.state-machine';
import { BookController } from './src/infraestructure/controllers/book.controller';

export const BookApiIntegrations: RestApiAppControllersType<AppRequestType> = {
  [BookCommands.CREATE_BOOK]: RestApiIntegration.StateMachine({ target: CreateBookStateMachine }),
  [BookCommands.ADD_COMMENT]: RestApiIntegration.StateMachine({ target: AddCommentStateMachine }),

  [BookEvents.BOOK_VERIFIED]: RestApiIntegration.EventBridge({ target: AppEventsBus }),

  [BookQueries.GET_BOOK]: RestApiIntegration.DynamoDb({
    target: BookTable,
    query: {
      KeyConditionExpression: '#pk = :pk AND #sk = :sk',
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
      },
      ExpressionAttributeValues: {
        ':pk': { S: 'BOOK' },
        ':sk': { S: "BOOK#$input.params('bookId')" },
      },
    },
    selectedFields: {
      id: '$field.id.S',
      name: '$field.name.S',
      commentsCount: '$field.commentsCount.N',
    },
  }),

  [BookQueries.GET_BOOK_AND_COMMENTS]: RestApiIntegration.Lambda({
    target: BookLambda,
    // authorizerFunction: ApiAuthorizersInfraestructureLambda,
    handlerProps: {
      controller: BookController,
      methodName: BookController.getBookWithComments.name,
    },
  }),
};
