import { DynamoDbBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/dynamo-db.builder';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class Auditory extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Auditory.name, { partitionKey: { name: 'id', type: AttributeType.STRING } });

    this.build();
  }
}
