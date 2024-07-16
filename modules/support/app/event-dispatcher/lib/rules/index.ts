import { EventBus } from 'aws-cdk-lib/aws-events';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { AppEventsRule } from './app-events.rule';
import { Every12HoursCronRule } from './every-12-hours-cron.rule';

export interface RulesProps {
  bus: EventBus;
  queue: Queue;
}

export class AppEventRules {
  constructor(scope: Construct, props: RulesProps) {
    new AppEventsRule(scope, props);
    new Every12HoursCronRule(scope, props);
  }
}
