import { BucketBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/bucket.builder';
import { Construct } from 'constructs';

export class Financial extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Financial.name, {});

    super.build();
  }
}
