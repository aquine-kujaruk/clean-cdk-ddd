import { Construct } from 'constructs';
import { EventBusBuilderConstruct } from '../../../construct-utils/builders/event-bus.builder';

export class DomainEventsBus extends EventBusBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, DomainEventsBus.name, {});
  }
}
