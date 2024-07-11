import { BucketBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/bucket.builder';
import { Construct } from 'constructs';

export class Datafrombundlecodes extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Datafrombundlecodes.name, {});

    this.build();
  }
}
