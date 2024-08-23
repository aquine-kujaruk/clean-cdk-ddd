import { LogGroupConstruct } from '@modules/common/app/lib/constructs/cloud-watch/log-group.construct';
import { RuleConstruct } from '@modules/common/app/lib/constructs/event-bridge/rule.construct';
import { Duration } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { CloudWatchLogGroup, SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { RulesProps } from '.';

export class Every12HoursSchedulerRule extends RuleConstruct {
  constructor(scope: Construct, props: RulesProps) {
    super(scope, Every12HoursSchedulerRule.name, {
      schedule: Schedule.rate(Duration.hours(12)),
      targets: Every12HoursSchedulerRule.getTargets(scope, props),
    });
  }

  private static getTargets = (scope: Construct, props: RulesProps) => {
    const { logGroup } = new LogGroupConstruct(
      scope,
      `/aws/events/${Every12HoursSchedulerRule.name}`
    );

    return [new SqsQueue(props.queue), new CloudWatchLogGroup(logGroup)];
  };
}
