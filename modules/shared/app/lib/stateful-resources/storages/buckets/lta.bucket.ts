import { BucketBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/bucket.builder';
import { Construct } from 'constructs';

export class Lta extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Lta.name, {});

    super.build();
  }
}
