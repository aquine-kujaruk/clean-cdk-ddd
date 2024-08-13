import { Stack } from 'aws-cdk-lib';
import { IRule, Rule, RuleProps } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import _ from 'lodash';
import {
  getConstructName,
  getStatelessResourceName,
  getUniqueConstructName,
} from '../resource-names';
import { BaseBuilder } from './base.builder';

interface RuleBuilderConstructProps extends RuleProps {}

export class RuleBuilderConstruct extends BaseBuilder<RuleBuilderConstructProps> {
  public rule: Rule;

  constructor(scope: Construct, name: string, props: RuleBuilderConstructProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getStatelessResourceName(this.name);
  }

  public static getArn(scope: Construct): string {
    const { region, account } = Stack.of(scope);
    return `arn:aws:events:${region}:${account}:rule:${this.resourceName}`;
  }

  public static getImportedResource(scope: Construct): IRule {
    return Rule.fromEventRuleArn(
      scope,
      getUniqueConstructName(this.name),
      this.getArn(scope)
    );
  }

  public build() {
    this.rule = new Rule(
      this,
      getConstructName(this.name),
      _.merge(
        {
          ruleName: getStatelessResourceName(this.name),
        } as Partial<RuleProps>,
        this.props
      )
    );
  }
}