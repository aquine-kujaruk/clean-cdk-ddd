import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';
import { ControllerClassType } from '../../../src/infraestructure/controllers/base.controller';
import { AuthorizerFunctionConstruct } from './authorizer-function.construct';
import { BaseIntegration } from './integrations/base.integration';
import {
  AuthorizerFunctionConstructType,
  RestApiConstructType,
  RestApiIntegrationTargetTypes,
} from '../construct.types';

export interface RestApiRequestIntegrationsProps {
  target: RestApiIntegrationTargetTypes;
  authorizer?: AuthorizerFunctionConstructType;
}

export interface RestApiRequestDynamoDbIntegrationsProps extends RestApiRequestIntegrationsProps {
  query: Omit<QueryCommandInput, 'TableName'>;
  selectedFields?: Record<string, string>;
}

export interface RestApiRequestLambdaIntegrationsProps extends RestApiRequestIntegrationsProps {
  handlerProps: {
    controller: ControllerClassType;
    methodName: string;
  };
}

export interface RestApiRequestEventBusIntegrationsProps extends RestApiRequestIntegrationsProps {
  eventType: string;
}

export interface RestApiIntegrationProps {
  api: RestApi;
  path: string;
  httpMethod: HttpMethod;
  apiEventSource?: string;
  authorizers: AuthorizerFunctionConstruct[];
}

export interface RestApiEndpointDefinition {
  path: string;
  apis: RestApiConstructType[];
  integration: (scope: Construct, props: RestApiIntegrationProps) => BaseIntegration;
}

export type RestApiEndpoint = Omit<RestApiEndpointDefinition, 'apis'> & {
  method: HttpMethod;
};

export interface CommandQueryType {
  resource: string;
  endpointDefinitions: RestApiEndpointDefinition[];
}
