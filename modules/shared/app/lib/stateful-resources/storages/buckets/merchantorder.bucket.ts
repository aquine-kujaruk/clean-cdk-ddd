import { BucketBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/bucket.builder';
import { Construct } from 'constructs';

export class MerchantOrder extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, MerchantOrder.name, {});

    super.build();
  }
}
