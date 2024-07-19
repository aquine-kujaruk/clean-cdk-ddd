import { RestApiIntegration } from '@modules/shared/app/lib/construct-utils/rest-apis/integration';
import { RestApiAppControllersType } from '@modules/shared/app/lib/construct-utils/rest-apis/rest-api.types';
import { EventStoreTable } from '@modules/shared/app/lib/stateful-resources/databases/dynamo-db/tables/event-store-table.table';
import { AppEventsBus } from '@modules/support/app/event-dispatcher/infraestructure/lib/app-events.bus';
import { AppRequestType } from '@modules/support/app/external-requests/infraestructure/app.requests';
import { ApiAuthorizersInfraestructureLambda } from '@modules/support/app/external-requests/infraestructure/lib/simple-authorizer.lambda';
import { BookCommands } from '../../book.commands';
import { BookEvents } from '../../book.events';
import { BookQueries } from '../../book.queries';
import { BookLambda } from '../book.lambda';
import { AddCommentStateMachine } from '../state-machines/add-comment.state-machine';
import { CreateBookStateMachine } from '../state-machines/create-book.state-machine';
import { BookService } from '../../../application/src/services/book.service';

export const BookController: RestApiAppControllersType<AppRequestType> = {
  [BookCommands.CREATE_BOOK]: RestApiIntegration.StateMachine({ target: CreateBookStateMachine }),
  [BookCommands.ADD_COMMENT]: RestApiIntegration.StateMachine({ target: AddCommentStateMachine }),

  [BookEvents.VERIFIED_BOOK]: RestApiIntegration.EventBridge({ target: AppEventsBus }),

  [BookQueries.GET_BOOK]: RestApiIntegration.DynamoDb({
    target: EventStoreTable,
    query: {
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': 'PK',
      },
      ExpressionAttributeValues: {
        ':pk': { S: "DOMAIN_EVENT#EVENT_TYPE#$input.params('eventType')" },
      },
    },
    selectedFields: {
      payload: '$fields.payload.S',
      ttl: '$fields.ttl.N',
    },
  }),

  // [BookQueries.GET_BOOK_AND_COMMENTS]: RestApiIntegration.Lambda({
  //   target: BookLambda,
  //   authorizerFunction: ApiAuthorizersInfraestructureLambda,
  //   handlerProps: {
  //     service: BookService,
  //     methodName: BookService.generateUuid.name,
  //   },
  // }),
};
