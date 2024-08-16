import { Construct } from 'constructs';
import { DomainEventsBus } from './busses/domain-events.bus';

export class EventBridge {
  constructor(scope: Construct) {
    new DomainEventsBus(scope);
  }
}
