import { IVpc, Vpc, VpcProps } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import _ from 'lodash';
import {
  getConstructName,
  getCommonResourceName,
  getUniqueConstructName,
} from '../services/resource-names.service';
import { BaseBuilder } from './base.builder';
import { CfnOutput } from 'aws-cdk-lib';

export class VpcBuilderConstruct extends BaseBuilder<VpcProps> {
  public vpc: Vpc;

  constructor(scope: Construct, name: string, props: VpcProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getCommonResourceName(this.name);
  }

  public static getImportedResource(scope: Construct): IVpc {
    const vpc = Vpc.fromLookup(scope, getUniqueConstructName(this.name), {
      vpcName: this.resourceName,
    });

    new CfnOutput(scope, "OutputVpn", {
      value: vpc.vpcId
    })

    return vpc;
  }

  public build() {
    this.vpc = new Vpc(
      this,
      getConstructName(this.name),
      _.merge(
        {
          vpcName: getCommonResourceName(this.name),
          maxAzs: 2,
          natGateways: 1,
        } as Partial<VpcProps>,
        this.props
      )
    );
  }
}
