import { BucketBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/bucket.builder';
import { Construct } from 'constructs';

export class Collectives extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Collectives.name, {});

    this.build();
  }
}
