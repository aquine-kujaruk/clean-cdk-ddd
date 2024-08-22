import {
  HandlerProps,
  ControllerRouter,
} from '@modules/common/app/src/infraestructure/handlers/lambda-handler.router';
import { BookController } from '../controllers/book.controller';
import { CommentController } from '../controllers/comment.controller';

const controllers = [BookController, CommentController];

export const handler = async (event: HandlerProps) => {
  console.log('Functions params: ', JSON.stringify(event, null, 2));

  const router = new ControllerRouter(event, controllers);

  return router.route();
};
