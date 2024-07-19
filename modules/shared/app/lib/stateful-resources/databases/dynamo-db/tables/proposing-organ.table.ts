import { DynamoDbBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class ProposingOrgan extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, ProposingOrgan.name, { partitionKey: { name: 'id', type: AttributeType.STRING } });

    super.build();
  }
}
