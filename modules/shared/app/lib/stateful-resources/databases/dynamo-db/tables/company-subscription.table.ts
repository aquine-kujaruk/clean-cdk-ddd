import { DynamoDbBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/dynamo-db.builder';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class CompanySubscription extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, CompanySubscription.name, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    super.build();
  }
}
