import {
  HandlerProps,
  LambdaHandlerRouter,
} from '@modules/shared/app/infraestructure/src/lambda-handler.router';
import { BookController } from '../controllers/book.controller';
import { CommentController } from '../controllers/comment.controller';

const controllers = [BookController, CommentController];

export const handler = async (event: HandlerProps) => {
  console.log('Functions params: ', JSON.stringify(event, null, 2));

  const router = new LambdaHandlerRouter(event, controllers);

  return router.route();
};
