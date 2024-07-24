import { DynamoDbBuilderConstruct } from '../../../../../lib/construct-utils/builders/dynamo-db.builder';
import { Construct } from 'constructs';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';

export class InvoiceConfig extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, InvoiceConfig.name, {
      partitionKey: { name: 'cfgKey', type: AttributeType.STRING },
    });

    const table = super.build();

    this.createIndexes(table);
  }

  private createIndexes(table: Table) {
    table.addGlobalSecondaryIndex({
      indexName: 'value-index',
      partitionKey: { name: 'cfgValue', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
