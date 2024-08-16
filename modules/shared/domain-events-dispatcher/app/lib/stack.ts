import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DomainEventsQueue } from './domain-events.queue';
import { DomainEventsLambda } from './domain-events.lambda';
import { DomainEventsRules } from './rules';

export class DomainEventsDispatcherStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const { queue } = new DomainEventsQueue(this);

    new DomainEventsRules(this, { queue });

    new DomainEventsLambda(this);
  }
}
