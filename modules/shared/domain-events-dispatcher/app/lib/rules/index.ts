import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { DomainEventsRule } from './domain-events.rule';
import { Every12HoursSchedulerRule } from './every-12-hours-cron.rule';

export interface RulesProps {
  queue: Queue;
}

export class DomainEventsRules {
  constructor(scope: Construct, props: RulesProps) {
    new DomainEventsRule(scope, props);
    new Every12HoursSchedulerRule(scope, props);
  }
}
