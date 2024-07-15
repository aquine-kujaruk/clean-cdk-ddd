import { DynamoDbBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class BundleCodes extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, BundleCodes.name, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'promotionCode-index',
      partitionKey: { name: 'promotionCode', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idSubscriptionARC-index',
      partitionKey: { name: 'idSubscriptionARC', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'company-index',
      partitionKey: { name: 'company', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'campaignDescription-index',
      partitionKey: { name: 'campaignDescription', type: AttributeType.STRING },
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
      indexName: 'uuidARC-index',
      partitionKey: { name: 'uuidARC', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'redeemDate-index',
      partitionKey: { name: 'redeemDate', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'beneficiaryEmail-index',
      partitionKey: { name: 'beneficiaryEmail', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'codeType-index',
      partitionKey: { name: 'codeType', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
