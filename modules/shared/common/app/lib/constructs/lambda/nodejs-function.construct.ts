import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import _ from 'lodash';
import { Configurations } from '../../../../../configurations';
import { getConstructName, getUserResourceName } from '../resource-names.util';
import { FunctionConstruct } from './function.construct';
import { LogGroupConstruct } from '../cloud-watch/log-group.construct';
import { LambdaRole } from '../../resources/iam/roles/lambda.role';
import { AppSecrets } from '../../resources/secret-manager/secrets/app.secret';

const { APP_NAME } = Configurations.getEnvs();

export class NodejsFunctionConstruct extends FunctionConstruct {
  constructor(scope: Construct, name: string, props: NodejsFunctionProps) {
    super(scope, name, props);
  }

  public build() {
    const functionName = getUserResourceName(this.name);
    const { logGroup } = new LogGroupConstruct(this, `/aws/lambda/${functionName}`);

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
          environment: {
            APP_NAME,
            APP_SECRETS_NAME: AppSecrets.resourceName,
          },
        } as Partial<NodejsFunctionProps>,
        this.props
      )
    );
  }
}
