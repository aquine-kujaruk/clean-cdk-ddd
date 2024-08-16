import { RestApiBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/rest-api.builder';
import { DomainEventSources } from '@modules/domain-events-dispatcher/app/domain-event.sources';
import { Construct } from 'constructs';
import { ApiIntegrations } from '../api.integrations';
import { AppRequestType } from '../api.requests';
import { PublicApiRoutes } from './routes/public-api.routes';

export class PublicApi extends RestApiBuilderConstruct<AppRequestType> {
  constructor(scope: Construct) {
    super(scope, PublicApi.name, {
      apiRoutes: PublicApiRoutes,
      appRoutes: ApiIntegrations,
      apiEventSource: DomainEventSources.PUBLIC_API,
    });
  }
}
