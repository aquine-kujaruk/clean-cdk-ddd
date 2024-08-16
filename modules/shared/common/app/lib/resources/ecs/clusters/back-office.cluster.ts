import { Construct } from 'constructs';
import { EcsClusterBuilderConstruct } from '../../../construct-utils/builders/ecs-cluster.builder';
import { CoreVpc } from '../../networking/vpcs/core.vpc';

export class BackOfficeCluster extends EcsClusterBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, BackOfficeCluster.name, {
      vpc: CoreVpc.getImportedResource(scope),
    });
  }
}
