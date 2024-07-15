import { DynamoDbBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/dynamo-db.builder';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class ProcessingUnit extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, ProcessingUnit.name, { partitionKey: { name: 'id', type: AttributeType.STRING } });

    super.build();
  }
}
