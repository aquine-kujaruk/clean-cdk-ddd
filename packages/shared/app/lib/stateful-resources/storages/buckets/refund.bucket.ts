import { BucketBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/bucket.builder';
import { Construct } from 'constructs';

export class Refund extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Refund.name, {});

    super.build();
  }
}
