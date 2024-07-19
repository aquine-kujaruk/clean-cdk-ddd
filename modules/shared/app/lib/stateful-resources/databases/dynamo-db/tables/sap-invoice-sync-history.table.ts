import { DynamoDbBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class SapInvoiceSyncHistory extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, SapInvoiceSyncHistory.name, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'fechaCreacion-index',
      partitionKey: { name: 'fechaCreacion', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'fechaReferenciaInicial-index',
      partitionKey: { name: 'fechaReferenciaInicial', type: AttributeType.STRING },
      sortKey: { name: 'fechaCreacion', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'totalAbsolutoFacturasSap-index',
      partitionKey: { name: 'totalAbsolutoFacturasSap', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'totalRelativoFacturasSap-index',
      partitionKey: { name: 'totalRelativoFacturasSap', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
