import { DynamoDbBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/dynamo-db.builder';
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
