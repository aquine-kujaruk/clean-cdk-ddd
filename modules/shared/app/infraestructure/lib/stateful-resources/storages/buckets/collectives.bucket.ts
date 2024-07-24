import { BucketBuilderConstruct } from '../../../../lib/construct-utils/builders/bucket.builder';
import { Construct } from 'constructs';

export class Collectives extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Collectives.name, {});

    super.build();
  }
}
