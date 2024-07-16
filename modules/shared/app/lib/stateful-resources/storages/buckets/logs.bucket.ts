import { BucketBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/bucket.builder';
import { Construct } from 'constructs';

export class Logs extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Logs.name, {});

    super.build();
  }
}
