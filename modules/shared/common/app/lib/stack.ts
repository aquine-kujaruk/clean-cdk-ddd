import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoDb } from './resources/databases';
import { Ecs } from './resources/ecs';
import { EventBridge } from './resources/event-bridge';
import { Roles } from './resources/iam';
import { LambdaFunctions } from './resources/lambda-functions';
import { Vpcs } from './resources/networking';
import { Secrets } from './resources/security';
import { Buckets } from './resources/storages';

export class CommonStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new DynamoDb(this);
    new Roles(this);
    new Buckets(this);
    new Secrets(this);
    new Vpcs(this);
    new Ecs(this);
    new EventBridge(this);
    new LambdaFunctions(this);
  }
}
