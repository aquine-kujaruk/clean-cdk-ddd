import {
  RestApiEventBusIntegration,
  RestApiSfnIntegration,
} from '@packages/shared/app/lib/helpers/rest-apis/integration';
import { RestApiAppRoutesType } from '@packages/shared/app/lib/helpers/rest-apis/rest-api.types';
import { AppEventsBus } from '@packages/support/app/event-dispatcher/lib/app-events.bus';
import { AppRequestType } from '@packages/support/app/external-requests/app.requests';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { CreateUserStateMachine } from './src/application/use-cases/create-user/create-user.state-machine';
import { UserCommands } from './user.commands';
import { UserEvents } from './user.events';

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
};
