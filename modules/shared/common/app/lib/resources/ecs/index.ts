import { Construct } from 'constructs';
import { BackOfficeCluster } from './clusters/back-office.cluster';

export class Ecs {
  constructor(scope: Construct) {
    new BackOfficeCluster(scope);
  }
}
