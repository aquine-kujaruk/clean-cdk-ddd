import { Router } from "./router";
import { HandlerProps } from "./router/base.router";

export const handler = async (event: HandlerProps) => {
  console.log('Functions params: ', JSON.stringify(event, null, 2));

  const router = new Router(event, []);

  return router.route();
};
