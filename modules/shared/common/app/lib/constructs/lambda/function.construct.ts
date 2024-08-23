import { Stack } from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Architecture, Function, FunctionProps, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import _ from 'lodash';
import { Configurations } from '../../../../../configurations';
import {
  getConstructName,
  getUniqueConstructName,
  getUserResourceName,
} from '../resource-names.util';
import { BaseConstruct } from '../base.construct';
import { LogGroupConstruct } from '../cloud-watch/log-group.construct';
import { LambdaRole } from '../../resources/iam/roles/lambda.role';
import { CoreVpc } from '../../resources/vpc/vpcs/core.vpc';
import { AppSecrets } from '../../resources/secret-manager/secrets/app.secret';

const { APP_NAME } = Configurations.getEnvs();

export class FunctionConstruct extends BaseConstruct<FunctionProps | NodejsFunctionProps> {
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
    const { logGroup } = new LogGroupConstruct(this, `/aws/lambda/${functionName}`);

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
          environment: {
            APP_NAME,
            APP_SECRETS_NAME: AppSecrets.resourceName
          },
        } as Partial<FunctionProps>,
        this.props as FunctionProps
      )
    );
  }
}
