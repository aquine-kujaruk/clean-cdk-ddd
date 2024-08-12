import { Construct } from 'constructs';
import { DynamoDb } from './databases';
import { Roles } from './iam';
import { Vpcs } from './networking';
import { Secrets } from './security';
import { Buckets } from './storages';

export class StatefulResources {
  constructor(scope: Construct) {
    new DynamoDb(scope);
    new Roles(scope);
    new Buckets(scope);
    new Secrets(scope);
    new Vpcs(scope);
  }
}
