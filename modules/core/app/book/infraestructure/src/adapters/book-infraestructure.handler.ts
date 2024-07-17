import {
  LambdaHandlerProps,
  LambdaHandlerRouter,
} from '@modules/shared/app/src/infraestructure/lambda-handler.router';
import { BookInfraestructureService } from '../../../infraestructure/src/services/book-infraestructure.service';

const services = [BookInfraestructureService];

export const handler = async (event: LambdaHandlerProps, context: any) => {
  console.log('context: ', JSON.stringify(context, null, 2));
  console.log('event: ', JSON.stringify(event, null, 2));

  const router = new LambdaHandlerRouter(event, services);

  return router.route();
};
