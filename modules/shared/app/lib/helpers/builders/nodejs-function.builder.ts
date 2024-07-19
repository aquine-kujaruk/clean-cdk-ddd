import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import _ from 'lodash';
import { LambdaRole } from '../../stateful-resources/iam/roles/lambda.role';
import { BaseBuilder } from './base.builder';
import { LambdaBuilderConstruct } from './lambda.builder';
import { LogGroupBuilderConstruct } from './log-group.builder';
import { RoleBuilderConstruct } from './role.builder';

export class NodejsFunctionBuilderConstruct extends BaseBuilder<
  NodejsFunction,
  NodejsFunctionProps
> {
  constructor(scope: Construct, id: string, props: NodejsFunctionProps) {
    super(scope, id, props);
  }

  public build(): NodejsFunction | undefined {
    // if (!super.isActive('function')) return;

    const functionName = LambdaBuilderConstruct.getResourceName(this.id);

    const handler = new NodejsFunction(
      this,
      LambdaBuilderConstruct.getConstructName(this.id),
      _.merge(
        {
          functionName,
          runtime: Runtime.NODEJS_20_X,
          architecture: Architecture.X86_64,
          role: RoleBuilderConstruct.getImportedResource(this, LambdaRole.name),
          logGroup: LogGroupBuilderConstruct.createResource(this, `/aws/lambda/${functionName}`),
          bundling: {
            minify: false,
            externalModules: ['aws-sdk/*', '@aws-sdk/*'],
            bundleAwsSDK: false,
          },
        } as Partial<NodejsFunctionProps>,
        this.props
      )
    );

    return handler;
  }
}
