import { Rule, RuleProps, Schedule } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { BaseBuilder } from './base.builder';

export class SchedulerBuilderConstruct extends BaseBuilder<Rule, RuleProps> {
  constructor(scope: Construct, id: string, props: RuleProps) {
    super(scope, id, props);
  }

  public static getResourceName(name: string): string {
    return SchedulerBuilderConstruct.getStatelessResourceName(name);
  }

  public static createResource(scope: Construct, name: string, schedule: Schedule): Rule {
    return new Rule(scope, `${name}Scheduler`, {
      ruleName: SchedulerBuilderConstruct.getResourceName(`${name}Scheduler`),
      schedule,
    });
  }

  public build(): undefined {}
}
