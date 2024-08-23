import { RemovalPolicy } from 'aws-cdk-lib';
import { LogGroup, LogGroupProps, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import _ from 'lodash';
import { getConstructName } from '../resource-names.util';
import { BaseConstruct } from '../base.construct';

export class LogGroupConstruct extends BaseConstruct<LogGroupProps> {
  public logGroup: LogGroup;

  constructor(scope: Construct, name: string, props: LogGroupProps = {}) {
    super(scope, name, props);

    this.build();
  }

  public build() {
    this.logGroup = new LogGroup(
      this,
      getConstructName(this.name),
      _.merge(
        {
          logGroupName: this.name,
          removalPolicy: RemovalPolicy.DESTROY,
          retention: RetentionDays.ONE_WEEK,
        } as Partial<LogGroupProps>,
        this.props
      )
    );
  }
}
