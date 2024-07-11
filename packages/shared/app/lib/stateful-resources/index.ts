import { Construct } from 'constructs';
import { DynamoDb } from './databases/dynamo-db';
import { Roles } from './iam/roles';
import { Secrets } from './security/secrets';
import { Buckets } from './storages/buckets';

export class StatefulResources {
  constructor(scope: Construct) {

    new DynamoDb(scope);
    new Roles(scope);
    new Buckets(scope);
    new Secrets(scope);
  }
}
