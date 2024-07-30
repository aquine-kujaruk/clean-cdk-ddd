import { BookCommands } from '@modules/core/app/book/infraestructure/book.commands';
import { BookEvents } from '@modules/core/app/book/infraestructure/book.events';
import { BookQueries } from '@modules/core/app/book/infraestructure/book.queries';
import { RestApiRouteType } from '@modules/shared/app/infraestructure/lib/construct-utils/rest-apis/rest-api.types';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { AppRequestType } from '../api.requests';

const { POST, GET, PUT, DELETE } = HttpMethod;

export const PublicApiRoutes: RestApiRouteType<AppRequestType> = {
  'book/command/create-book': {
    [POST]: BookCommands.CREATE_BOOK,
  },

  'book/command/add-comment/{bookId}': {
    [POST]: BookCommands.ADD_COMMENT,
  },

  'book/event/verified-book': {
    [POST]: BookEvents.BOOK_VERIFIED,
  },

  'book/query/get-book/{bookId}': {
    [GET]: BookQueries.GET_BOOK,
  },

  'book/query/get-books-and-comments/{bookId}': {
    [GET]: BookQueries.GET_BOOK_AND_COMMENTS,
  },

  'book/query/get-books-and-comments/{bookId}/test': {
    [GET]: BookQueries.GET_BOOK_AND_COMMENTS,
  },
};
