import {
  HandlerProps,
  LambdaHandlerRouter,
} from '@modules/common/app/src/infraestructure/lambda-handler.router';
import { BookController } from './infraestructure/controllers/book.controller';
import { CommentController } from './infraestructure/controllers/comment.controller';

const controllers = [BookController, CommentController];

export const handler = async (event: HandlerProps) => {
  console.log('Functions params: ', JSON.stringify(event, null, 2));

  const router = new LambdaHandlerRouter(event, controllers);

  return router.route();
};
