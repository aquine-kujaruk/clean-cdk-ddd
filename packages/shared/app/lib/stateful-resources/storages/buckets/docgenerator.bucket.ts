import { BucketBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/bucket.builder';
import { Construct } from 'constructs';

export class Docgenerator extends BucketBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, Docgenerator.name, {});

    this.build();
  }
}
