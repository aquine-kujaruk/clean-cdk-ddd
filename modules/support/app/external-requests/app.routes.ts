import { routes as userRoutes } from '@modules/core/app/user/user.routes';
import { RestApiAppRoutesType } from '@modules/shared/app/lib/helpers/rest-apis/rest-api.types';
import { AppRequestType } from './app.requests';

const routes: RestApiAppRoutesType<AppRequestType> = { ...userRoutes };

export default routes;