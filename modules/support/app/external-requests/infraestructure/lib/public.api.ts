import { RestApiBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/rest-api.builder';
import { Construct } from 'constructs';
import { AppEventSources } from '../../../event-dispatcher/infraestructure/app.event-sources';
import { AppRequestType } from '../app.requests';
import { AppControllers } from '../app.controller';
import { PublicApiRoutes } from '../routes/public-api.routes';

export class PublicApi extends RestApiBuilderConstruct<AppRequestType> {
  constructor(scope: Construct) {
    super(scope, PublicApi.name, {
      apiRoutes: PublicApiRoutes,
      appRoutes: AppControllers,
      apiEventSource: AppEventSources.PUBLIC_API,
    });

    super.build();
  }
}
