import { RestApiBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/rest-api.builder';
import { Construct } from 'constructs';
import { AppEventSources } from '../../../event-dispatcher/infraestructure/app.event-sources';
import { AppRequestType } from '../api.requests';
import { ApiIntegrations } from '../api.integrations';
import { PublicApiRoutes } from '../routes/public-api.routes';

export class PublicApi extends RestApiBuilderConstruct<AppRequestType> {
  constructor(scope: Construct) {
    super(scope, PublicApi.name, {
      apiRoutes: PublicApiRoutes,
      appRoutes: ApiIntegrations,
      apiEventSource: AppEventSources.PUBLIC_API,
    });
  }
}
