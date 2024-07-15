import {
  RestApiEventBusIntegration,
  RestApiSfnIntegration,
  RestApiDaynamoDbIntegration,
  RestApiLambdaIntegration,
} from '@packages/shared/app/lib/helpers/rest-apis/integration';
import { RestApiAppRoutesType } from '@packages/shared/app/lib/helpers/rest-apis/rest-api.types';
import { AppEventsBus } from '@packages/support/app/event-dispatcher/lib/app-events.bus';
import { AppRequestType } from '@packages/support/app/external-requests/app.requests';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { CreateUserStateMachine } from './src/application/use-cases/create-user/create-user.state-machine';
import { UserCommands } from './user.commands';
import { UserEvents } from './user.events';
import { UserQueries } from './user.queries';
import { EventStoreTable } from '@packages/shared/app/lib/stateful-resources/databases/dynamo-db/tables/event-store-table.table';
import { UserInfraestructureLambda } from './src/infraestructure/user-infraestructure.lambda';
import { UserInfraestructureController } from './src/infraestructure/code/controllers/user-infraestructure.controller';
import { ApiAuthorizersInfraestructureLambda } from '@packages/support/app/external-requests/src/infraestructure/api-authorizers-infraestructure.lambda';

export const routes: RestApiAppRoutesType<AppRequestType> = {
  [UserCommands.CREATE_USER]: {
    [HttpMethod.POST]: RestApiSfnIntegration.build({
      target: CreateUserStateMachine,
    }),
  },
  [UserEvents.GIFT_REDEEMED]: {
    [HttpMethod.POST]: RestApiEventBusIntegration.build({
      target: AppEventsBus,
    }),
  },
  [UserQueries.GET_USER]: {
    [HttpMethod.GET]: RestApiDaynamoDbIntegration.build({
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
  },
  [UserQueries.GET_UUID]: {
    [HttpMethod.POST]: RestApiLambdaIntegration.build({
      target: UserInfraestructureLambda,
      authorizerFunction: ApiAuthorizersInfraestructureLambda,
      handlerProps: {
        controller: UserInfraestructureController,
        methodName: UserInfraestructureController.generateUuid.name,
      },
    }),
  },
};
