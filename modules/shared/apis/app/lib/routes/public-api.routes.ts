import { BookCommands } from '@modules/books/app/book.commands';
// import { BookEvents } from '@modules/books/app/book.events';
import { BookQueries } from '@modules/books/app/book.queries';
import { RestApiRouteType } from '@modules/common/app/lib/construct-utils/rest-apis/rest-api.types';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { AppRequestType } from '../../api.requests';

const { POST, GET, PUT, DELETE } = HttpMethod;

export const PublicApiRoutes: RestApiRouteType<AppRequestType> = {
  'book/command/create-book': {
    [POST]: BookCommands.CREATE_BOOK,
  },

  'book/command/add-comment/{bookId}': {
    [POST]: BookCommands.ADD_COMMENT,
  },

  // 'book/event/verified-book': {
  //   [POST]: BookEvents.BOOK_VERIFIED,
  // },

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
