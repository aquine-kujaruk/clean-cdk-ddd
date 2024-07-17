import { BookRoutes } from '@modules/core/app/book/infraestructure/book.routes';
import { RestApiAppRoutesType } from '@modules/shared/app/lib/helpers/rest-apis/rest-api.types';
import { AppRequestType } from '../app.requests';

export const AppRoutes: RestApiAppRoutesType<AppRequestType> = { ...BookRoutes };