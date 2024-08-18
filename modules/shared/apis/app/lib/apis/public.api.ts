import { RestApiBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/rest-api.builder';
import { DomainEventSources } from '@modules/domain-events-dispatcher/app/domain-event.sources';
import { Construct } from 'constructs';
import { ApisProps } from '../stack';

export class PublicApi extends RestApiBuilderConstruct {
  constructor(scope: Construct, props: ApisProps) {
    super(scope, PublicApi.name, {
      ...props,
      apiEventSource: DomainEventSources.PUBLIC_API
    });
  }
}
