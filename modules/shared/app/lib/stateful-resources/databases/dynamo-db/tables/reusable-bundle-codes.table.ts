import { DynamoDbBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/dynamo-db.builder';
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
