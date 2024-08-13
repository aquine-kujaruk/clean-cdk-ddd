import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppEventsBus } from './app-events.bus';
import { AppEventsQueue } from './app-events.queue';
import { EventDispatcherLambda } from './event-dispatcher-infraestructure.lambda';
import { AppEventRules } from './rules';

export class EventDispatcherStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const { queue } = new AppEventsQueue(this);
    const { bus } = new AppEventsBus(this);

    new AppEventRules(this, { bus, queue });

    new EventDispatcherLambda(this);
  }
}
