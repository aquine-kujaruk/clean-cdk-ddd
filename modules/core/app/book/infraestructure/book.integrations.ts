import { BookController } from '@modules/core/app/book/infraestructure/src/controllers/book.controller';
import { RestApiIntegration } from '@modules/shared/app/infraestructure/lib/construct-utils/rest-apis/integration';
import { RestApiAppControllersType } from '@modules/shared/app/infraestructure/lib/construct-utils/rest-apis/rest-api.types';
import { MultiPurpose } from '@modules/shared/app/infraestructure/lib/stateful-resources/databases/dynamo-db/tables/multi-purpose.table';
import { AppRequestType } from '@modules/support/app/apis/infraestructure/api.requests';
import { AppEventsBus } from '@modules/support/app/event-dispatcher/infraestructure/lib/app-events.bus';
import { BookCommands } from './book.commands';
import { BookEvents } from './book.events';
import { BookQueries } from './book.queries';
import { BookLambda } from './lib/book.lambda';
import { AddCommentStateMachine } from './lib/state-machines/add-comment.state-machine';
import { CreateBookStateMachine } from './lib/state-machines/create-book.state-machine';

export const BookApiIntegrations: RestApiAppControllersType<AppRequestType> = {
  [BookCommands.CREATE_BOOK]: RestApiIntegration.StateMachine({ target: CreateBookStateMachine }),
  [BookCommands.ADD_COMMENT]: RestApiIntegration.StateMachine({ target: AddCommentStateMachine }),

  [BookEvents.BOOK_VERIFIED]: RestApiIntegration.EventBridge({ target: AppEventsBus }),

  [BookQueries.GET_BOOK]: RestApiIntegration.DynamoDb({
    target: MultiPurpose,
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
