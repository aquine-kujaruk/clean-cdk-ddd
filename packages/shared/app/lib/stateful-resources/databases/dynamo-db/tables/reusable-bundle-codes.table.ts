import { DynamoDbBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/dynamo-db.builder';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class ReusableBundleCodes extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, ReusableBundleCodes.name, {
      partitionKey: { name: 'code', type: AttributeType.STRING },
    });

    super.build();
  }
}
