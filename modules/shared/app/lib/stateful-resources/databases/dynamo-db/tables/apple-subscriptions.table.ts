import { DynamoDbBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class AppleSubscriptions extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, AppleSubscriptions.name, {
      partitionKey: { name: 'original_transaction_id', type: AttributeType.STRING },
    });

    super.build();
  }
}
