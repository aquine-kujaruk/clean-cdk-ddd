import { BucketBuilderConstruct } from '../../../../lib/construct-utils/builders/bucket.builder';
import { Construct } from 'constructs';

export class Estaticos extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Estaticos.name, {});

    super.build();
  }
}
