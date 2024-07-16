import { RuleBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/rule.builder';
import { Duration } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { RulesProps } from '.';

export class Every12HoursCronRule extends RuleBuilderConstruct {
  constructor(scope: Construct, props: RulesProps) {
    super(scope, Every12HoursCronRule.name, {
      schedule: Schedule.rate(Duration.hours(12)),
      targets: Every12HoursCronRule.getTargets(scope),
    });

    super.build();
  }

  private static getTargets = (scope: Construct) => [];
}
