import { RemovalPolicy } from 'aws-cdk-lib';
import { LogGroup, LogGroupProps, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { BaseBuilder } from './base.builder';

export class LogGroupBuilderConstruct extends BaseBuilder<LogGroup, LogGroupProps> {
  constructor(scope: Construct, id: string, props: LogGroupProps) {
    super(scope, id, props);
  }

  public static createResource(scope: Construct, logGroupName: string): LogGroup {
    return new LogGroup(scope, logGroupName, {
      logGroupName,
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_WEEK,
    });
  }

  public build(): undefined {}
}
