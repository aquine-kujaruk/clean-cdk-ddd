import { IRule, Rule, RuleProps } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import _ from 'lodash';
import { BaseBuilder } from './base.builder';

interface RuleBuilderConstructProps extends RuleProps {}

export class RuleBuilderConstruct extends BaseBuilder<Rule, RuleBuilderConstructProps> {
  constructor(scope: Construct, id: string, props: RuleBuilderConstructProps) {
    super(scope, id, props);
  }

  public static getResourceName(name: string): string {
    return this.getStatelessResourceName(name);
  }

  public static getArn(scope: Construct, name: string): string {
    const { region, account } = this.getStack(scope);
    return `arn:aws:events:${region}:${account}:rule:${RuleBuilderConstruct.getResourceName(name)}`;
  }

  public static getImportedResource(scope: Construct, name: string): IRule {
    return Rule.fromEventRuleArn(
      scope,
      RuleBuilderConstruct.getConstructName(name),
      RuleBuilderConstruct.getArn(scope, name)
    );
  }

  public build(): Rule {
    const rule = new Rule(
      this,
      RuleBuilderConstruct.getConstructName(this.id),
      _.merge(
        {
          ruleName: RuleBuilderConstruct.getResourceName(this.id),
        } as Partial<RuleProps>,
        this.props
      )
    );

    return rule;
  }
}
