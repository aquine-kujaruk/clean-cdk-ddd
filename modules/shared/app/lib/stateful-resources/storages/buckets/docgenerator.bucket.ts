import { BucketBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/bucket.builder';
import { Construct } from 'constructs';

export class Docgenerator extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Docgenerator.name, {});

    super.build();
  }
}
