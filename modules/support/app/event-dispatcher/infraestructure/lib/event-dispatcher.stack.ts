import { Construct } from 'constructs';
import { AppEventsBus } from './app-events.bus';
import { AppEventsQueue } from './app-events.queue';
import { AppEventRules } from './rules';
import { EventDispatcherInfraestructureLambda } from './event-dispatcher-infraestructure.lambda';
import { NestedStack } from 'aws-cdk-lib';

export class EventDispatcher extends NestedStack {
  constructor(scope: Construct) {
    super(scope, EventDispatcher.name);

    const { queue } = new AppEventsQueue(scope);
    const { bus } = new AppEventsBus(scope);

    new AppEventRules(scope, { bus, queue });

    new EventDispatcherInfraestructureLambda(scope);
  }
}
