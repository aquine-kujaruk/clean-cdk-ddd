import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoDb } from './resources/dynamo-db';
import { Ecs } from './resources/ecs';
import { EventBridge } from './resources/event-bridge';
import { Iam } from './resources/iam';
import { Lambda } from './resources/lambda';
import { S3 } from './resources/s3';
import { SecretManager } from './resources/secret-manager';
import { Vpc } from './resources/vpc';

export class CommonStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new DynamoDb(this);
    new Iam(this);
    new S3(this);
    new SecretManager(this);
    new Vpc(this);
    new Ecs(this);
    new EventBridge(this);
    new Lambda(this);
  }
}
