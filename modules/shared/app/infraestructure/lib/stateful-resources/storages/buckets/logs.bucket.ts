import { BucketBuilderConstruct } from '../../../../lib/construct-utils/builders/bucket.builder';
import { Construct } from 'constructs';

export class Logs extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Logs.name, {});

    super.build();
  }
}