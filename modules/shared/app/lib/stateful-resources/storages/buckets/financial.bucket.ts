import { BucketBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/bucket.builder';
import { Construct } from 'constructs';

export class Financial extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Financial.name, {});

    super.build();
  }
}
