import {
    RestApiDaynamoDbIntegration,
    RestApiEventBusIntegration,
    RestApiLambdaIntegration,
    RestApiSfnIntegration,
} from '@modules/shared/app/lib/helpers/rest-apis/integration';
import { RestApiAppRoutesType } from '@modules/shared/app/lib/helpers/rest-apis/rest-api.types';
import { EventStoreTable } from '@modules/shared/app/lib/stateful-resources/databases/dynamo-db/tables/event-store-table.table';
import { AppEventsBus } from '@modules/support/app/event-dispatcher/infraestructure/lib/app-events.bus';
import { AppRequestType } from '@modules/support/app/external-requests/infraestructure/app.requests';
import { ApiAuthorizersInfraestructureLambda } from '@modules/support/app/external-requests/infraestructure/lib/simple-authorizer.lambda';
import { CreateBookStateMachine } from './lib/state-machines/create-book.state-machine';
import { BookInfraestructureLambda } from './lib/book-infraestructure.lambda';
import { BookInfraestructureService } from './src/services/book-infraestructure.service';
import { BookCommands } from './book.commands';
import { BookEvents } from './book.events';
import { BookQueries } from './book.queries';

export const BookRoutes: RestApiAppRoutesType<AppRequestType> = {
  [BookCommands.CREATE_BOOK]: RestApiSfnIntegration.build({ target: CreateBookStateMachine }),

  [BookEvents.GIFT_REDEEMED]: RestApiEventBusIntegration.build({ target: AppEventsBus }),

  [BookQueries.GET_BOOK]: RestApiDaynamoDbIntegration.build({
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

  [BookQueries.GET_UUID]: RestApiLambdaIntegration.build({
    target: BookInfraestructureLambda,
    authorizerFunction: ApiAuthorizersInfraestructureLambda,
    handlerProps: {
      service: BookInfraestructureService,
      methodName: BookInfraestructureService.generateUuid.name,
    },
  }),
};
