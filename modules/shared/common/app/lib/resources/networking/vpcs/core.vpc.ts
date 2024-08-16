import { Construct } from 'constructs';
import { VpcBuilderConstruct } from '../../../construct-utils/builders/vpc.builder';

export class CoreVpc extends VpcBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, CoreVpc.name, {});
  }
}
