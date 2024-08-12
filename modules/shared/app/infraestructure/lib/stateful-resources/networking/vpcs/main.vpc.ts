import { Construct } from 'constructs';
import { VpcBuilderConstruct } from '../../../construct-utils/builders/vpc.builder';

export class MainVpc extends VpcBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, MainVpc.name, {});
  }
}
