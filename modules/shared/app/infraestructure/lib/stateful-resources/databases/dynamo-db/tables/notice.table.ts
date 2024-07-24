import { DynamoDbBuilderConstruct } from '../../../../../lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class Notice extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Notice.name, { partitionKey: { name: 'id', type: AttributeType.STRING } });

    super.build();
  }
}
