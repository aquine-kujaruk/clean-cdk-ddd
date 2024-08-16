import { LogGroupBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/log-group.builder';
import { RuleBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/rule.builder';
import { Duration } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { CloudWatchLogGroup, SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { RulesProps } from '.';

export class Every12HoursSchedulerRule extends RuleBuilderConstruct {
  constructor(scope: Construct, props: RulesProps) {
    super(scope, Every12HoursSchedulerRule.name, {
      schedule: Schedule.rate(Duration.hours(12)),
      targets: Every12HoursSchedulerRule.getTargets(scope, props),
    });
  }

  private static getTargets = (scope: Construct, props: RulesProps) => {
    const { logGroup } = new LogGroupBuilderConstruct(
      scope,
      `/aws/events/${Every12HoursSchedulerRule.name}`
    );

    return [new SqsQueue(props.queue), new CloudWatchLogGroup(logGroup)];
  };
}
