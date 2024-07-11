import { BucketBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/bucket.builder';
import { Construct } from 'constructs';

export class Estaticos extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Estaticos.name, {});

    this.build();
  }
}
