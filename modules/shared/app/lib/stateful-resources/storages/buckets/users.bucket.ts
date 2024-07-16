import { BucketBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/bucket.builder';
import { Construct } from 'constructs';

export class Users extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Users.name, {});

    super.build();
  }
}
