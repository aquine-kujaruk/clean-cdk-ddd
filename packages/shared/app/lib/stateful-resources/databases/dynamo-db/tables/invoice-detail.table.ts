import { DynamoDbBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class InvoiceDetail extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, InvoiceDetail.name, { partitionKey: { name: 'id', type: AttributeType.STRING } });

    const table = this.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'idFacturaCompleta-index',
      partitionKey: { name: 'idFacturaCompleta', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'iva-index',
      partitionKey: { name: 'iva', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idEdicom-index',
      partitionKey: { name: 'idEdicom', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idFacturaSimple-index',
      partitionKey: { name: 'idFacturaSimple', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idPagoARC-index',
      partitionKey: { name: 'idPagoARC', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'importe-index',
      partitionKey: { name: 'importe', type: AttributeType.STRING },
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
      indexName: 'idNotaCredito-index',
      partitionKey: { name: 'idNotaCredito', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idSuscripcionARC-index',
      partitionKey: { name: 'idSuscripcionARC', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'syncStatus-index',
      partitionKey: { name: 'syncStatus', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'fechaPagoARC-index',
      partitionKey: { name: 'fechaPagoARC', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
