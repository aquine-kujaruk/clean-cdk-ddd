import { Stack } from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Architecture, Function, FunctionProps, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import _ from 'lodash';
import { LambdaRole } from '../../resources/iam/roles/lambda.role';
import { CoreVpc } from '../../resources/networking/vpcs/core.vpc';
import {
  getConstructName,
  getUserResourceName,
  getUniqueConstructName,
} from '../resource-names';
import { BaseBuilder } from './base.builder';
import { LogGroupBuilderConstruct } from './log-group.builder';

export class LambdaBuilderConstruct extends BaseBuilder<FunctionProps | NodejsFunctionProps> {
  public handler?: Function;

  constructor(scope: Construct, name: string, props: FunctionProps | NodejsFunctionProps) {
    super(scope, name, props);

    // if (super.isActive('function')) {
    this.build();
    // }
  }

  public static get resourceName(): string {
    return getUserResourceName(this.name);
  }

  public static getArn(scope: Construct): string {
    const { region, account } = Stack.of(scope);
    return `arn:aws:lambda:${region}:${account}:function:${this.resourceName}`;
  }

  public static getImportedResource(scope: Construct): IFunction {
    return Function.fromFunctionName(scope, getUniqueConstructName(this.name), this.resourceName);
  }

  public build() {
    const functionName = getUserResourceName(this.name);
    const { logGroup } = new LogGroupBuilderConstruct(this, `/aws/lambda/${functionName}`);

    this.handler = new Function(
      this,
      getConstructName(this.name),
      _.merge(
        {
          functionName,
          handler: 'index.handler',
          runtime: Runtime.NODEJS_20_X,
          architecture: Architecture.X86_64,
          role: LambdaRole.getImportedResource(this),
          logGroup,
          vpc: CoreVpc.getImportedResource(this),
          vpcSubnets: {
            subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          },
        } as Partial<FunctionProps>,
        this.props as FunctionProps
      )
    );
  }
}
