import { Construct } from 'constructs';
import { EcsClusterBuilderConstruct } from '../../../construct-utils/builders/ecs-cluster.builder';
import { MainVpc } from '../../networking/vpcs/main.vpc';

export class BackOfficeCluster extends EcsClusterBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, BackOfficeCluster.name, {
      vpc: MainVpc.getImportedResource(scope),
    });
  }
}
