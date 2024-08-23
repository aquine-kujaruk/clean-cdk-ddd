import { Construct } from 'constructs';
import { ClusterConstruct } from '../../../constructs/ecs/cluster.construct';
import { CoreVpc } from '../../vpc/vpcs/core.vpc';

export class BackOfficeCluster extends ClusterConstruct {
  constructor(scope: Construct) {
    super(scope, BackOfficeCluster.name, {
      vpc: CoreVpc.getImportedResource(scope),
    });
  }
}
