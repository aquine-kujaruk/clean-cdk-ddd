import { Stack } from 'aws-cdk-lib';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ClusterProps, ICluster } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import _ from 'lodash';
import { getConstructName, getCommonResourceName } from '../resource-names';
import { BaseBuilder } from './base.builder';

export class EcsClusterBuilderConstruct extends BaseBuilder<ClusterProps> {
  public cluster: Cluster;

  constructor(scope: Construct, name: string, props: ClusterProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getCommonResourceName(this.name);
  }

  public static getArn(scope: Construct): string {
    const { region, account } = Stack.of(scope);
    return `arn:aws:ecs:${region}:${account}:cluster/${this.resourceName}`;
  }

  public static getImportedResource(scope: Construct, vpc: IVpc): ICluster {
    return Cluster.fromClusterAttributes(scope, getConstructName(this.name), {
      clusterName: this.resourceName,
      vpc,
    });
  }

  public build() {
    this.cluster = new Cluster(
      this,
      getConstructName(this.name),
      _.merge(
        {
          clusterName: getCommonResourceName(this.name),
        } as Partial<ClusterProps>,
        this.props
      )
    );
  }
}
