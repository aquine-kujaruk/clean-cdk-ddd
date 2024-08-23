import { Construct } from 'constructs';
import { VpcConstruct } from '../../../constructs/vpc/vpc.construct';

export class CoreVpc extends VpcConstruct {
  constructor(scope: Construct) {
    super(scope, CoreVpc.name, {});
  }
}
