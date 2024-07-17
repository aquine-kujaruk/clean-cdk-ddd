import {
  LambdaHandlerProps,
  LambdaHandlerRouter,
} from '@modules/shared/app/src/infraestructure/lambda-handler.router';
import { BookDomainService } from '../services/book-domain.service';

const services = [BookDomainService];

export const handler = async (event: LambdaHandlerProps) => {
  console.log('event: ', JSON.stringify(event, null, 2));

  const router = new LambdaHandlerRouter(event, services);

  return router.route();
};
