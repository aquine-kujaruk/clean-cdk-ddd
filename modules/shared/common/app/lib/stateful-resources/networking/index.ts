import { Construct } from 'constructs';
import { MainVpc } from './vpcs/main.vpc';

export class Vpcs {
  constructor(scope: Construct) {
    new MainVpc(scope);
  }
}
