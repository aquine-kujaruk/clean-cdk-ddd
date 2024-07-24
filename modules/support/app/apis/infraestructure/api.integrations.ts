import { BookApiIntegrations } from '@modules/core/app/book/infraestructure/book.integrations';
import { RestApiAppControllersType } from '@modules/shared/app/infraestructure/lib/construct-utils/rest-apis/rest-api.types';
import { AppRequestType } from './api.requests';

export const ApiIntegrations: RestApiAppControllersType<AppRequestType> = { ...BookApiIntegrations };