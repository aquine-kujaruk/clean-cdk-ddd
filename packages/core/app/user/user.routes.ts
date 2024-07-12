import {
  RestApiEventBusIntegration,
  RestApiSfnIntegration,
  RestApiDaynamoDbIntegration,
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
      responseDefinition: `
        #set($inputRoot = $input.path('$'))
        {
        "response": [
            #foreach($field in $inputRoot.Items) {
              "payload": "$field.payload.S",
              "ttl": "$field.ttl.S"
            }#if($foreach.hasNext),#end
            #end
          ]
        }
      `,
    }),
  },
};
