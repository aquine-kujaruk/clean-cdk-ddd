import { BucketBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/bucket.builder';
import { Construct } from 'constructs';

export class MerchantOrder extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, MerchantOrder.name, {});

    this.build();
  }
}
