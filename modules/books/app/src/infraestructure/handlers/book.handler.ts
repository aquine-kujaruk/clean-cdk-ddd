import { Router } from '@modules/common/app/src/infraestructure/handlers/router';
import { HandlerProps } from '@modules/common/app/src/infraestructure/handlers/router/base.router';
import { SfnHandlerProps } from '@modules/common/app/src/infraestructure/handlers/router/sfn-task.router';
import { BookController } from '../controllers/book.controller';
import { CommentController } from '../controllers/comment.controller';

const controllers = [BookController, CommentController];

export const handler = async (event: HandlerProps | SfnHandlerProps) => {
  console.log('Functions params: ', JSON.stringify(event, null, 2));

  const router = new Router(event, controllers);
  return router.route();
};
