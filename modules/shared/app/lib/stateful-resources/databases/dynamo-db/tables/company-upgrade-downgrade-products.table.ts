import { DynamoDbBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/dynamo-db.builder';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class CompanyUpgradeDowngradeProducts extends DynamoDbBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, CompanyUpgradeDowngradeProducts.name, {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    super.build();
  }
}
