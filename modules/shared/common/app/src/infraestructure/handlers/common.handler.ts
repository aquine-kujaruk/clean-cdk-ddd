import { ControllerRouter, HandlerProps } from './lambda-handler.router';

export const handler = async (event: HandlerProps) => {
  console.log('Functions params: ', JSON.stringify(event, null, 2));

  const router = new ControllerRouter(event, []);

  return router.route();
};
