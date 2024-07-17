import { RestApiBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/rest-api.builder';
import { Construct } from 'constructs';
import { AppEventSources } from '../../../event-dispatcher/infraestructure/appevent.event-sources';
import { AppRequestType } from '../app.requests';
import { AppRoutes } from '../routes/app.routes';
import { PublicApiRoutes } from '../routes/public-api.routes';

export class PublicApi extends RestApiBuilderConstruct<AppRequestType> {
  constructor(scope: Construct) {
    super(scope, PublicApi.name, {
      apiRoutes: PublicApiRoutes,
      appRoutes: AppRoutes,
      apiEventSource: AppEventSources.PUBLIC_API,
    });

    super.build();
  }
}
