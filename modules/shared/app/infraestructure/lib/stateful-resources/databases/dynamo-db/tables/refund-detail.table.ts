import { DynamoDbBuilderConstruct } from '../../../../../lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class RefundDetail extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, RefundDetail.name, { partitionKey: { name: 'id', type: AttributeType.STRING } });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'companyId-index',
      partitionKey: { name: 'companyId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'iva-index',
      partitionKey: { name: 'iva', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'fechaPago-index',
      partitionKey: { name: 'fechaPago', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'importe-index',
      partitionKey: { name: 'importe', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idSubscripcionArc-index',
      partitionKey: { name: 'idSubscripcionArc', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idFactura-index',
      partitionKey: { name: 'idFactura', type: AttributeType.STRING },
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

    table.addGlobalSecondaryIndex({
      indexName: 'uuidARC-index',
      partitionKey: { name: 'uuidARC', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'fechaRefund-index',
      partitionKey: { name: 'fechaRefund', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idPagoArc-index',
      partitionKey: { name: 'idPagoArc', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'region-index',
      partitionKey: { name: 'region', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'productName-index',
      partitionKey: { name: 'productName', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'tipoFactura-index',
      partitionKey: { name: 'tipoFactura', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'orderNumber-index',
      partitionKey: { name: 'orderNumber', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idFacturaOrig-index',
      partitionKey: { name: 'idFacturaOrig', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'sku-index',
      partitionKey: { name: 'sku', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'country-index',
      partitionKey: { name: 'country', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'site-index',
      partitionKey: { name: 'site', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
