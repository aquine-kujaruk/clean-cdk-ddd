import { BucketBuilderConstruct } from '../../../../lib/construct-utils/builders/bucket.builder';
import { Construct } from 'constructs';

export class Financial extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Financial.name, {});

    super.build();
  }
}
