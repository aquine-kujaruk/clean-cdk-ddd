import { DynamoDbBuilderConstruct } from '../../../../../lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class ArcEvent extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, ArcEvent.name, {
      partitionKey: { name: 'site', type: AttributeType.STRING },
    });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'date-index',
      partitionKey: { name: 'date', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'event-index',
      partitionKey: { name: 'event', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'finished-index',
      partitionKey: { name: 'finished', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'executionId-index',
      partitionKey: { name: 'executionId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'failed-index',
      partitionKey: { name: 'failed', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
