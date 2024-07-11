import { routes as userRoutes } from '@packages/core/app/user/user.routes';
import { RestApiAppRoutesType } from '@packages/shared/app/lib/helpers/rest-apis/rest-api.types';
import { AppRequestType } from './app.requests';

const routes: RestApiAppRoutesType<AppRequestType> = { ...userRoutes };

export default routes;