import { BillingMode } from '@aws-sdk/client-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Table, TableProps } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import _ from 'lodash';
import { BaseBuilder } from './base.builder';

export class DynamoDbBuilderConstruct extends BaseBuilder<Table, TableProps> {
  constructor(scope: Construct, id: string, props: TableProps) {
    super(scope, id, props);
  }

  public static getResourceName(name: string): string {
    return this.getStatefulResourceName(name);
  }

  public build(): Table {
    const table = new Table(
      this,
      DynamoDbBuilderConstruct.getConstructName(this.id),
      _.merge(
        {
          tableName: DynamoDbBuilderConstruct.getResourceName(this.id),
          removalPolicy: RemovalPolicy.DESTROY,
          billingMode: BillingMode.PAY_PER_REQUEST,
        } as Partial<TableProps>,
        this.props
      )
    );

    return table;
  }
}
