import { BillingMode } from '@aws-sdk/client-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Table, TableProps } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import _ from 'lodash';
import { getConstructName, getCommonResourceName } from '../services/resource-names.service';
import { BaseBuilder } from './base.builder';

export class DynamoDbBuilderConstruct extends BaseBuilder<TableProps> {
  public table: Table;

  constructor(scope: Construct, name: string, props: TableProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getCommonResourceName(this.name);
  }

  public build() {
    this.table = new Table(
      this,
      getConstructName(this.name),
      _.merge(
        {
          tableName: getCommonResourceName(this.name),
          removalPolicy: RemovalPolicy.DESTROY,
          billingMode: BillingMode.PAY_PER_REQUEST,
        } as Partial<TableProps>,
        this.props
      )
    );
  }
}
