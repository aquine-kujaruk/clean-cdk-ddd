import { EventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { AppEventsRule } from './app-events.rule';
import { Every12HoursCronRule } from './every-12-hours-cron.rule';

export interface RulesProps {
  bus: EventBus;
}

export class AppEventRules {
  constructor(scope: Construct, props: RulesProps) {
    new AppEventsRule(scope, props);
    new Every12HoursCronRule(scope, props);
  }
}
