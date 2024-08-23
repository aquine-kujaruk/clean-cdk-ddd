import { RestApiConstruct } from '@modules/common/app/lib/constructs/api-gateway/rest-api.construct';
import { DomainEventSources } from '@modules/domain-events-dispatcher/app/domain-event.sources';
import { Construct } from 'constructs';
import { ApisProps } from '../stack';

export class PublicApi extends RestApiConstruct {
  constructor(scope: Construct, props: ApisProps) {
    super(scope, PublicApi.name, {
      ...props,
      apiEventSource: DomainEventSources.PUBLIC_API
    });
  }
}
