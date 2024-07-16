import { RestApiBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/rest-api.builder';
import { Construct } from 'constructs';
import { AppEventSources } from '../../../event-dispatcher/appevent.event-sources';
import { AppRequestType } from '../../app.requests';
import appRoutes from '../../app.routes';
import apiRoutes from './api.routes';

export class PublicApi extends RestApiBuilderConstruct<AppRequestType> {
  constructor(scope: Construct) {
    super(scope, PublicApi.name, {
      apiRoutes,
      appRoutes,
      apiEventSource: AppEventSources.PUBLIC_API,
    });

    super.build();
  }
}
