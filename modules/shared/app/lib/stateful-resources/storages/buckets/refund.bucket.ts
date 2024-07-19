import { BucketBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/bucket.builder';
import { Construct } from 'constructs';

export class Refund extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Refund.name, {});

    super.build();
  }
}
