import { UserCommands } from '@modules/core/app/user/user.commands';
import { UserEvents } from '@modules/core/app/user/user.events';
import { UserQueries } from '@modules/core/app/user/user.queries';
import { RestApiRouteType } from '@modules/shared/app/lib/helpers/rest-apis/rest-api.types';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { AppRequestType } from '../../app.requests';

const routes: RestApiRouteType<AppRequestType> = {
  'user/command/create-user': {
    [HttpMethod.POST]: UserCommands.CREATE_USER,
  },

  'user/event/create-user': {
    [HttpMethod.POST]: UserEvents.GIFT_REDEEMED,
  },

  'user/query/get-user/{eventType}': {
    [HttpMethod.GET]: UserQueries.GET_USER,
  },

  'user/query/get-uuid/{param}': {
    [HttpMethod.POST]: UserQueries.GET_UUID,
  },
};

export default routes;
