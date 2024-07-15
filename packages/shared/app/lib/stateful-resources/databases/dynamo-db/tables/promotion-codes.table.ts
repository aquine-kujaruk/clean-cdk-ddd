import { DynamoDbBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class PromotionCodes extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, PromotionCodes.name, {
      partitionKey: { name: 'key', type: AttributeType.STRING },
    });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'company-index',
      partitionKey: { name: 'company', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idSuscripcionARC-index',
      partitionKey: { name: 'idSuscripcionARC', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'sku-index',
      partitionKey: { name: 'sku', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'used-index',
      partitionKey: { name: 'used', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'site-index',
      partitionKey: { name: 'site', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
