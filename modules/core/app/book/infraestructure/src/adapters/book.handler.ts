import {
  LambdaHandlerProps,
  LambdaHandlerRouter,
} from '@modules/shared/app/src/infraestructure/lambda-handler.router';
import { BookService } from '../../../application/src/services/book.service';
import { CommentService } from '../../../application/src/services/comment.service';

const services = [BookService, CommentService];

export const handler = async (event: LambdaHandlerProps) => {
  console.log('Functions params: ', JSON.stringify(event, null, 2));

  const router = new LambdaHandlerRouter(event, services);

  return router.route();
};
