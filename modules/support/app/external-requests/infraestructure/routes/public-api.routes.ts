import { BookCommands } from '@modules/core/app/book/infraestructure/book.commands';
import { BookEvents } from '@modules/core/app/book/infraestructure/book.events';
import { BookQueries } from '@modules/core/app/book/infraestructure/book.queries';
import { RestApiRouteType } from '@modules/shared/app/lib/construct-utils/rest-apis/rest-api.types';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { AppRequestType } from '../app.requests';

export const PublicApiRoutes: RestApiRouteType<AppRequestType> = {
  'book/command/create-book': {
    [HttpMethod.POST]: BookCommands.CREATE_BOOK,
  },

  'book/command/add-comment/{bookId}': {
    [HttpMethod.POST]: BookCommands.ADD_COMMENT,
  },

  'book/event/verified-book': {
    [HttpMethod.POST]: BookEvents.VERIFIED_BOOK,
  },

  'book/query/get-book/{bookId}': {
    [HttpMethod.GET]: BookQueries.GET_BOOK,
  },

  'book/query/get-books-and-comments/{bookId}': {
    [HttpMethod.POST]: BookQueries.GET_BOOK_AND_COMMENTS,
  },
};
