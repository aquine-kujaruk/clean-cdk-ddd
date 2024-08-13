import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';
import { ControllerClassType } from '../../../src/infraestructure/controllers/base.controller';
import { LambdaConstructType, RestApiIntegrationTargetTypes } from '../construct.types';
import { RestApiBaseIntegration } from './integration';

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

export type RestApiAppControllersType<T extends string | number | symbol> = {
  [key in T]?: (scope: Construct, props: RestApiIntegrationProps) => RestApiBaseIntegration;
};

export type RestApiRouteType<T extends string | number | symbol> = {
  [key in string]: { [key in HttpMethod]?: T };
};
