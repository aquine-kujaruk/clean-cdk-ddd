import { Construct } from 'constructs';
import { EventBusConstruct } from '../../../constructs/event-bridge/event-bus.construct';

export class DomainEventsBus extends EventBusConstruct {
  constructor(scope: Construct) {
    super(scope, DomainEventsBus.name, {});
  }
}
