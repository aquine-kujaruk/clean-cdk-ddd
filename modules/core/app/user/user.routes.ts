import {
  RestApiDaynamoDbIntegration,
  RestApiEventBusIntegration,
  RestApiLambdaIntegration,
  RestApiSfnIntegration,
} from '@modules/shared/app/lib/helpers/rest-apis/integration';
import { RestApiAppRoutesType } from '@modules/shared/app/lib/helpers/rest-apis/rest-api.types';
import { EventStoreTable } from '@modules/shared/app/lib/stateful-resources/databases/dynamo-db/tables/event-store-table.table';
import { AppEventsBus } from '@modules/support/app/event-dispatcher/lib/app-events.bus';
import { AppRequestType } from '@modules/support/app/external-requests/app.requests';
import { ApiAuthorizersInfraestructureLambda } from '@modules/support/app/external-requests/src/infraestructure/api-authorizers-infraestructure.lambda';
import { CreateUserStateMachine } from './src/application/use-cases/create-user/create-user.state-machine';
import { UserInfraestructureController } from './src/infraestructure/code/controllers/user-infraestructure.controller';
import { UserInfraestructureLambda } from './src/infraestructure/user-infraestructure.lambda';
import { UserCommands } from './user.commands';
import { UserEvents } from './user.events';
import { UserQueries } from './user.queries';

export const routes: RestApiAppRoutesType<AppRequestType> = {
  [UserCommands.CREATE_USER]: RestApiSfnIntegration.build({ target: CreateUserStateMachine }),

  [UserEvents.GIFT_REDEEMED]: RestApiEventBusIntegration.build({ target: AppEventsBus }),

  [UserQueries.GET_USER]: RestApiDaynamoDbIntegration.build({
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

  [UserQueries.GET_UUID]: RestApiLambdaIntegration.build({
    target: UserInfraestructureLambda,
    authorizerFunction: ApiAuthorizersInfraestructureLambda,
    handlerProps: {
      controller: UserInfraestructureController,
      methodName: UserInfraestructureController.generateUuid.name,
    },
  }),
};
