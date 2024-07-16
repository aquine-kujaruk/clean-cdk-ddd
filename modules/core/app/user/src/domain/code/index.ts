
import { LambdaHandlerProps, LambdaHandlerRouter } from '@modules/shared/app/src/infraestructure/lambda-handler.router';
import { UserDomainController } from './controllers/user-domain.controller';

const controllers = [UserDomainController];

export const handler = async (event: LambdaHandlerProps) => {
  console.log('event: ', JSON.stringify(event, null, 2));

  const router = new LambdaHandlerRouter(event, controllers);

  return router.route();
};
