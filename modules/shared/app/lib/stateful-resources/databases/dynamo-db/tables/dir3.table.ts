import { DynamoDbBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class Dir3 extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Dir3.name, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'accountingoffice-index',
      partitionKey: { name: 'accountingofficeId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'proposingorgan-index',
      partitionKey: { name: 'proposingorganId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'managementorgan-index',
      partitionKey: { name: 'managementorganId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'processingunit-index',
      partitionKey: { name: 'processingunitId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
