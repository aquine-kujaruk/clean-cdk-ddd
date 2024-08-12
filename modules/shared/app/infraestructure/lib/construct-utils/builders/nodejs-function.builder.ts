import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import _ from 'lodash';
import { LambdaRole } from '../../stateful-resources/iam/roles/lambda.role';
import { getConstructName, getStatelessResourceName } from '../resource-names';
import { LambdaBuilderConstruct } from './lambda.builder';
import { LogGroupBuilderConstruct } from './log-group.builder';

export class NodejsFunctionBuilderConstruct extends LambdaBuilderConstruct {
  constructor(scope: Construct, name: string, props: NodejsFunctionProps) {
    super(scope, name, props);
  }

  public build() {
    const functionName = getStatelessResourceName(this.name);
    const { logGroup } = new LogGroupBuilderConstruct(this, `/aws/lambda/${functionName}`);

    this.handler = new NodejsFunction(
      this,
      getConstructName(this.name),
      _.merge(
        {
          functionName,
          runtime: Runtime.NODEJS_20_X,
          architecture: Architecture.X86_64,
          role: LambdaRole.getImportedResource(this),
          logGroup,
          bundling: {
            minify: false,
            externalModules: ['aws-sdk/*', '@aws-sdk/*'],
            bundleAwsSDK: false,
          },
        } as Partial<NodejsFunctionProps>,
        this.props
      )
    );
  }
}
