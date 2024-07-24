import { DynamoDbBuilderConstruct } from '../../../../../lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class Gifts extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Gifts.name, { partitionKey: { name: 'redeemToken', type: AttributeType.STRING } });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'giverEmail-index',
      partitionKey: { name: 'giverEmail', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'redeemToken-index',
      partitionKey: { name: 'redeemToken', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'type-index',
      partitionKey: { name: 'type', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'giverUuid-index',
      partitionKey: { name: 'giverUuid', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'used-index',
      partitionKey: { name: 'used', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
