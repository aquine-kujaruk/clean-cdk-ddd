import { LambdaIntegration, Model, PassthroughBehavior } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { LambdaConstructType } from '../types/construct.types';
import {
  RestApiIntegrationProps,
  RestApiRequestLambdaIntegrationsProps,
} from '../types/rest-api.types';
import { BaseIntegration } from './base.integration';

class LambdaFunctionIntegration extends BaseIntegration {
  private constructor(
    scope: Construct,
    props: RestApiIntegrationProps & RestApiRequestLambdaIntegrationsProps
  ) {
    super(scope, props);

    const handler = (this.props.target as any).getImportedResource(this.scope);

    const integration = new LambdaIntegration(handler, {
      proxy: false,
      passthroughBehavior: PassthroughBehavior.WHEN_NO_MATCH,
      requestTemplates: {
        'application/json': `
          #set($inputRoot = $input.path('$'))
          {
            "input": {
              "body": $input.json('$'),
              "headers": {
                #foreach($header in $input.params().header.keySet())
                  "$header": "$input.params().header.get($header)"#if($foreach.hasNext),#end
                #end
              },
              "path": {
                #foreach($param in $input.params().path.keySet())
                  "$param": "$input.params().path.get($param)"#if($foreach.hasNext),#end
                #end
              },
              "query": {
                #foreach($queryParam in $input.params().querystring.keySet())
                  "$queryParam": "$input.params().querystring.get($queryParam)"#if($foreach.hasNext),#end
                #end
              },
              "authorizerContext": {
                #foreach($contextKey in $context.authorizer.keySet())
                  "$contextKey": "$context.authorizer.get($contextKey)"#if($foreach.hasNext),#end
                #end
              }
            },
            "controller": "${props.handlerProps.controller.name}",
            "methodName": "${props.handlerProps.methodName}"
          }
        `,
      },
      integrationResponses: [
        ...super.awsDefaultIntegrationResponses,
        {
          statusCode: '200',
          responseTemplates: {
            'application/json': "$input.path('$')",
          },
        },
      ],
    });

    super.addMethod(integration, {
      methodResponses: [
        {
          statusCode: '200',
          responseModels: {
            'application/json': Model.EMPTY_MODEL,
          },
        },
      ],
    });
  }

  static setup(
    requestProps: RestApiRequestLambdaIntegrationsProps & { target: LambdaConstructType }
  ) {
    return (scope: Construct, props: RestApiIntegrationProps) =>
      new LambdaFunctionIntegration(scope, { ...props, ...requestProps });
  }
}

export default LambdaFunctionIntegration.setup;
