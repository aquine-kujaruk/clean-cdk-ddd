import { BookController } from '@modules/core/app/book/infraestructure/lib/controllers/book.controller';
import { RestApiAppControllersType } from '@modules/shared/app/lib/helpers/rest-apis/rest-api.types';
import { AppRequestType } from './app.requests';

export const AppControllers: RestApiAppControllersType<AppRequestType> = { ...BookController };