import { BucketBuilderConstruct } from '../../../../lib/construct-utils/builders/bucket.builder';
import { Construct } from 'constructs';

export class Datafrombundlecodes extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Datafrombundlecodes.name, {});

    super.build();
  }
}