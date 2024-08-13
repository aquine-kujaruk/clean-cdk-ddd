import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoDb } from './stateful-resources/databases';
import { Ecs } from './stateful-resources/ecs';
import { Roles } from './stateful-resources/iam';
import { Vpcs } from './stateful-resources/networking';
import { Secrets } from './stateful-resources/security';
import { Buckets } from './stateful-resources/storages';

export class CommonStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new DynamoDb(this);
    new Roles(this);
    new Buckets(this);
    new Secrets(this);
    new Vpcs(this);
    new Ecs(this);
  }
}
