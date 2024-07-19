import { DynamoDbBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class MerchantOrderDetail extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, MerchantOrderDetail.name, {
      partitionKey: { name: 'gatewayId', type: AttributeType.STRING },
    });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'idPagoArc-index',
      partitionKey: { name: 'idPagoArc', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'importe-index',
      partitionKey: { name: 'importe', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'orderNumber-index',
      partitionKey: { name: 'orderNumber', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idSubscripcionArc-index',
      partitionKey: { name: 'idSubscripcionArc', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'transactionType-index',
      partitionKey: { name: 'transactionType', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'creditCardType-index',
      partitionKey: { name: 'creditCardType', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'moneda-index',
      partitionKey: { name: 'moneda', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'sent-index',
      partitionKey: { name: 'sent', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
