import { BookApiIntegrations } from '@modules/books/app/book.integrations';
import { RestApiAppControllersType } from '@modules/common/app/lib/construct-utils/rest-apis/rest-api.types';
import { AppRequestType } from './api.requests';

export const ApiIntegrations: RestApiAppControllersType<AppRequestType> = {
  ...BookApiIntegrations,
};
