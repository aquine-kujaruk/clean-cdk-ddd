import { Construct } from 'constructs';
import { BucketBuilderConstruct } from '../../../construct-utils/builders/bucket.builder';

export class BackOfficeBucket extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, BackOfficeBucket.name, {});
  }
}
