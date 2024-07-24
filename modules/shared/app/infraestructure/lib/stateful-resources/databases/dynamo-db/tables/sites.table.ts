import { DynamoDbBuilderConstruct } from '../../../../../lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class Sites extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Sites.name, { partitionKey: { name: 'id', type: AttributeType.STRING } });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'entitlement-index',
      partitionKey: { name: 'entitlement', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'site-index',
      partitionKey: { name: 'site', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
