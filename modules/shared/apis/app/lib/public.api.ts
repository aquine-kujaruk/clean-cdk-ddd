import { RestApiBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/rest-api.builder';
import { Construct } from 'constructs';
import { ApiIntegrations } from '../api.integrations';
import { AppRequestType } from '../api.requests';
import { PublicApiRoutes } from './routes/public-api.routes';
import { AppEventSources } from '@modules/event-dispatcher/app/app.event-sources';

export class PublicApi extends RestApiBuilderConstruct<AppRequestType> {
  constructor(scope: Construct) {
    super(scope, PublicApi.name, {
      apiRoutes: PublicApiRoutes,
      appRoutes: ApiIntegrations,
      apiEventSource: AppEventSources.PUBLIC_API,
    });
  }
}
