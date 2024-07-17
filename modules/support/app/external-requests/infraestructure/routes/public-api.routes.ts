import { BookCommands } from '@modules/core/app/book/infraestructure/book.commands';
import { BookEvents } from '@modules/core/app/book/infraestructure/book.events';
import { BookQueries } from '@modules/core/app/book/infraestructure/book.queries';
import { RestApiRouteType } from '@modules/shared/app/lib/helpers/rest-apis/rest-api.types';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { AppRequestType } from '../app.requests';

export const PublicApiRoutes: RestApiRouteType<AppRequestType> = {
  'book/command/create-book': {
    [HttpMethod.POST]: BookCommands.CREATE_BOOK,
  },

  'book/event/create-book': {
    [HttpMethod.POST]: BookEvents.GIFT_REDEEMED,
  },

  'book/query/get-book/{eventType}': {
    [HttpMethod.GET]: BookQueries.GET_BOOK,
  },

  'book/query/get-uuid/{param}': {
    [HttpMethod.POST]: BookQueries.GET_UUID,
  },
};