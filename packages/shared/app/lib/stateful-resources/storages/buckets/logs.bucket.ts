import { BucketBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/bucket.builder';
import { Construct } from 'constructs';

export class Logs extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Logs.name, {});

    this.build();
  }
}
