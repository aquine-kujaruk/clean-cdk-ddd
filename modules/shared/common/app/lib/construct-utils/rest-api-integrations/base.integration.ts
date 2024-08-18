import {
  AuthorizationType,
  AwsIntegration,
  IResource,
  MethodOptions,
} from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { RestApiIntegrationProps, RestApiRequestIntegrationsProps } from '../types/rest-api.types';

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

    if (this.props.authorizer) {
      if (!this.props.authorizers) {
        throw new Error(
          `Authorizers param must be provided to ${this.props.api.node.id} to use authorizer`
        );
      }

      const { authorizer } =
        this.props.authorizers.find((auth) => {
          return auth.name === this.props.authorizer?.name;
        }) || {};

      if (!authorizer) {
        throw new Error(`Authorizer ${this.props.authorizer?.name} not found in authorizers list`);
      }

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
