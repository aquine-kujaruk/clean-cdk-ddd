import { DynamoDbBuilderConstruct } from '../../../../../lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class SubscriptionsOrigin extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, SubscriptionsOrigin.name, {
      partitionKey: { name: 'idSuscripcionArc', type: AttributeType.STRING },
    });

    super.build();
  }
}
