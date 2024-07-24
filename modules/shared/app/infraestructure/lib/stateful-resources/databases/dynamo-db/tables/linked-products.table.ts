import { DynamoDbBuilderConstruct } from '../../../../../lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class LinkedProducts extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, LinkedProducts.name, { partitionKey: { name: 'id', type: AttributeType.STRING } });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'skuBuyed-index',
      partitionKey: { name: 'skuBuyed', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}