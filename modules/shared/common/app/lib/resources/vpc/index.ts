import { Construct } from 'constructs';
import { CoreVpc } from './vpcs/core.vpc';

export class Vpc {
  constructor(scope: Construct) {
    new CoreVpc(scope);
  }
}
