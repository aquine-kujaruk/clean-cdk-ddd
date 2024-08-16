import { AttributeType, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { DynamoDbBuilderConstruct } from '../../../construct-utils/builders/dynamo-db.builder';

export class BookTable extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, BookTable.name, {
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      timeToLiveAttribute: 'ttl',
    });

    this.createIndexes();
  }

  private createIndexes() {
    this.table.addGlobalSecondaryIndex({
      indexName: 'GSI1-index',
      partitionKey: { name: 'GSI1PK', type: AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.table.addGlobalSecondaryIndex({
      indexName: 'GSI2-index',
      partitionKey: { name: 'GSI2PK', type: AttributeType.STRING },
      sortKey: { name: 'GSI2SK', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
