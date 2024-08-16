import {
  getConstructName,
  getUserResourceName,
} from '@modules/common/app/lib/construct-utils/resource-names';
import {
  RestApiIntegrationProps,
  RestApiRequestIntegrationsProps,
} from '@modules/common/app/lib/construct-utils/rest-apis/rest-api.types';
import { Duration } from 'aws-cdk-lib';
import {
  AuthorizationType,
  AwsIntegration,
  IResource,
  IdentitySource,
  MethodOptions,
  RequestAuthorizer,
} from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';

export abstract class BaseIntegration {
  handler: IStateMachine | IFunction;

  protected constructor(
    readonly scope: Construct,
    readonly props: RestApiIntegrationProps & RestApiRequestIntegrationsProps
  ) {}

  addMethod(integration: AwsIntegration, options: MethodOptions = {}) {
    const pathArray = this.props.path.split('/');
    let apiResource: IResource | undefined;

    for (const resourceString of pathArray) {
      if (apiResource) apiResource = apiResource.getResource(resourceString);
      else apiResource = this.props.api.root.getResource(resourceString);
    }

    if (this.props.authorizerFunction) {
      const handler = (this.props.authorizerFunction as any).getImportedResource(this.scope);

      const authorizerName = `${this.props.authorizerFunction.name}Authorizer`;

      const authorizer = new RequestAuthorizer(this.scope, getConstructName(authorizerName), {
        authorizerName: getUserResourceName(authorizerName),
        handler,
        identitySources: [IdentitySource.header('authorization')],
        resultsCacheTtl: Duration.seconds(0),
      });

      options = {
        ...options,
        authorizer,
        authorizationType: AuthorizationType.CUSTOM,
      };
    }

    apiResource?.addMethod(this.props.httpMethod, integration, options);
  }

  get awsDefaultIntegrationResponses() {
    return [
      {
        selectionPattern: '400',
        statusCode: '400',
        responseTemplates: {
          'application/json': JSON.stringify({
            error: 'Bad input!',
          }),
        },
      },
      {
        selectionPattern: '5\\d{2}',
        statusCode: '500',
        responseTemplates: {
          'application/json': JSON.stringify({
            error: 'Internal Service Error!',
          }),
        },
      },
    ];
  }
}
