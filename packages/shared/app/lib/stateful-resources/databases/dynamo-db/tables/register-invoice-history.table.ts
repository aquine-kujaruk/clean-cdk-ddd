import { DynamoDbBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class RegisterInvoiceHistory extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, RegisterInvoiceHistory.name, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'fechaActualizacion-index',
      partitionKey: { name: 'fechaActualizacion', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idSuscripcion-index',
      partitionKey: { name: 'idSuscripcion', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'fechaCreacion-index',
      partitionKey: { name: 'fechaCreacion', type: AttributeType.STRING },
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
      indexName: 'tipoCliente-index',
      partitionKey: { name: 'tipoCliente', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'moneda-index',
      partitionKey: { name: 'moneda', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'nombreArchivo-index',
      partitionKey: { name: 'nombreArchivo', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'merchantOrder-index',
      partitionKey: { name: 'merchantOrder', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'idPago-index',
      partitionKey: { name: 'idPago', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
