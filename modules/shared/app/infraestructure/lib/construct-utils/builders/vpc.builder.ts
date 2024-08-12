import { IVpc, Vpc, VpcProps } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import _ from 'lodash';
import { getConstructName, getStatefulResourceName } from '../resource-names';
import { BaseBuilder } from './base.builder';

export class VpcBuilderConstruct extends BaseBuilder<VpcProps> {
  public vpc: Vpc;

  constructor(scope: Construct, name: string, props: VpcProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getStatefulResourceName(this.name);
  }

  public static getImportedResource(scope: Construct): IVpc {
    return Vpc.fromLookup(scope, getConstructName(this.name), {
      vpcName: this.resourceName,
    });
  }

  public build() {
    this.vpc = new Vpc(
      this,
      getConstructName(this.name),
      _.merge(
        {
          vpcName: getStatefulResourceName(this.name),
          maxAzs: 2,
          natGateways: 1,
        } as Partial<VpcProps>,
        this.props
      )
    );
  }
}
