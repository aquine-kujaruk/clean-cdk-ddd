import { DynamoDbBuilderConstruct } from '../../../../../lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class BillingType extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, BillingType.name, {
      partitionKey: { name: 'subscriptionID', type: AttributeType.STRING },
    });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'bookID-index',
      partitionKey: { name: 'bookID', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'subscriptionType-index',
      partitionKey: { name: 'subscriptionType', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
