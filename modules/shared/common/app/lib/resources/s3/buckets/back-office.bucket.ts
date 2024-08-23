import { Construct } from 'constructs';
import { BucketConstruct } from '../../../constructs/s3/bucket.construct';

export class BackOfficeBucket extends BucketConstruct {
  constructor(scope: Construct) {
    super(scope, BackOfficeBucket.name, {});
  }
}
