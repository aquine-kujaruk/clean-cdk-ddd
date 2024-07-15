import { DynamoDbBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class SwgSubscriptions extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, SwgSubscriptions.name, {
      partitionKey: { name: 'purchaseToken', type: AttributeType.STRING },
    });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'orderId-index',
      partitionKey: { name: 'orderId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'user_uuid-index',
      partitionKey: { name: 'user_uuid', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
