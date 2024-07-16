import { Construct } from 'constructs';
import { BucketBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/bucket.builder';

export class Backups extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Backups.name, {});

    super.build();
  }
}
