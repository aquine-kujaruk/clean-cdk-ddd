import { Construct } from 'constructs';
import { CoreVpc } from './vpcs/core.vpc';

export class Vpcs {
  constructor(scope: Construct) {
    new CoreVpc(scope);
  }
}
