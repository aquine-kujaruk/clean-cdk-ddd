import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';
import { LambdaConstructType, RestApiIntegrationTargetTypes } from '../construct.types';
import { RestApiIntegration } from './integration';
import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ControllerClassType } from '@packages/shared/app/src/infraestructure/controllers/base.controller';

// Integration types
export interface RestApiRequestIntegrationsProps {
  target: RestApiIntegrationTargetTypes;
  authorizerFunction?: LambdaConstructType;
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

export interface RestApiIntegrationProps {
  api: RestApi;
  path: string;
  httpMethod: HttpMethod;
  apiEventSource: string;
}

export type RestApiRouteDefinitionType = {
  [key in HttpMethod]?: (scope: Construct, props: RestApiIntegrationProps) => RestApiIntegration;
};

export type RestApiAppRoutesType<T extends string | number | symbol> = Partial<{
  [key in T]: RestApiRouteDefinitionType;
}>;

export type RestApiRouteType<T extends string | number | symbol> = {
  request: T;
  path: string;
  methods: HttpMethod[];
};
