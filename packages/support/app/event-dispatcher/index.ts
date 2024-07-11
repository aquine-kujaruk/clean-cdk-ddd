import { Construct } from 'constructs';
import { AppEventsBus } from './lib/app-events.bus';
import { AppEventsQueue } from './lib/app-events.queue';
import { AppEventRules } from './lib/rules';
import { EventDispatcherInfraestructureLambda } from './src/infraestructure/event-dispatcher-infraestructure.lambda';

export class EventDispatcher {
  constructor(scope: Construct) {
    new AppEventsQueue(scope);
    const { bus } = new AppEventsBus(scope);
    new AppEventRules(scope, { bus });
    
    new EventDispatcherInfraestructureLambda(scope);
  }
}
