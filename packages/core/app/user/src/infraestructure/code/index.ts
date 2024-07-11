
import { UserInfraestructureController } from './controllers/user-infraestructure.controller';
import { LambdaHandlerProps, LambdaHandlerRouter } from '@packages/shared/app/src/infraestructure/lambda-handler.router';

const controllers = [UserInfraestructureController];

export const handler = async (event: LambdaHandlerProps) => {
  console.log('event: ', JSON.stringify(event, null, 2));

  const router = new LambdaHandlerRouter(event, controllers);

  return router.route();
};
