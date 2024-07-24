import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { Duration } from 'aws-cdk-lib';
import {
  AuthorizationType,
  AwsIntegration,
  IResource,
  IdentitySource,
  LambdaIntegration,
  MethodOptions,
  Model,
  PassthroughBehavior,
  RequestAuthorizer,
  StepFunctionsIntegration,
} from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { BaseBuilder } from '../builders/base.builder';
import { DynamoDbBuilderConstruct } from '../builders/dynamo-db.builder';
import { EventBusBuilderConstruct } from '../builders/event-bus.builder';
import { RoleBuilderConstruct } from '../builders/role.builder';
import {
  DynamoDbConstructType,
  EventBusConstructType,
  LambdaConstructType,
  StateMachineConstructType,
} from '../construct.types';
import {
  RestApiIntegrationProps,
  RestApiRequestDynamoDbIntegrationsProps,
  RestApiRequestIntegrationsProps,
  RestApiRequestLambdaIntegrationsProps,
} from './rest-api.types';
import { StateMachineBuilderConstruct } from '../builders/state-machine.builder';
import { LambdaBuilderConstruct } from '../builders/lambda.builder';
import { RestApiIntegrationRole } from '../../stateful-resources/iam/roles/rest-api-integration.role';

export abstract class RestApiBaseIntegration {
  protected handler: IStateMachine | IFunction;

  constructor(
    protected readonly scope: Construct,
    protected readonly props: RestApiIntegrationProps & RestApiRequestIntegrationsProps
  ) {}

  protected addMethod(integration: AwsIntegration, options: MethodOptions = {}) {
    const pathArray = this.props.path.split('/');
    let apiResource: IResource | undefined;

    for (const resourceString of pathArray) {
      if (apiResource) apiResource = apiResource.getResource(resourceString);
      else apiResource = this.props.api.root.getResource(resourceString);
    }

    if (this.props.authorizerFunction) {
      const handler = LambdaBuilderConstruct.getImportedResource(
        this.scope,
        this.props.authorizerFunction.name
      );

      const authorizerName = `${this.props.authorizerFunction.name}Authorizer`;

      const authorizer = new RequestAuthorizer(
        this.scope,
        BaseBuilder.getConstructName(authorizerName),
        {
          authorizerName: BaseBuilder.getStatelessResourceName(authorizerName),
          handler,
          identitySources: [IdentitySource.header('authorization')],
          resultsCacheTtl: Duration.seconds(0),
        }
      );

      options = {
        ...options,
        authorizer,
        authorizationType: AuthorizationType.CUSTOM,
      };
    }

    apiResource?.addMethod(this.props.httpMethod, integration, options);
  }

  protected get awsDefaultIntegrationResponses() {
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

class RestApiSfnIntegration extends RestApiBaseIntegration {
  constructor(scope: Construct, props: RestApiIntegrationProps & RestApiRequestIntegrationsProps) {
    super(scope, props);

    const handler = StateMachineBuilderConstruct.getImportedResource(this.scope, props.target.name);

    const integration = StepFunctionsIntegration.startExecution(handler, {
      useDefaultMethodResponses: true,
    });

    super.addMethod(integration);
  }

  static setup(
    requestProps: RestApiRequestIntegrationsProps & { target: StateMachineConstructType }
  ) {
    return (scope: Construct, props: RestApiIntegrationProps) =>
      new RestApiSfnIntegration(scope, { ...props, ...requestProps });
  }
}

class RestApiLambdaIntegration extends RestApiBaseIntegration {
  constructor(
    scope: Construct,
    props: RestApiIntegrationProps & RestApiRequestLambdaIntegrationsProps
  ) {
    super(scope, props);

    const handler = LambdaBuilderConstruct.getImportedResource(this.scope, props.target.name);

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
      new RestApiLambdaIntegration(scope, { ...props, ...requestProps });
  }
}

class RestApiDaynamoDbIntegration extends RestApiBaseIntegration {
  constructor(
    scope: Construct,
    props: RestApiIntegrationProps & RestApiRequestDynamoDbIntegrationsProps
  ) {
    super(scope, props);

    const TableName = DynamoDbBuilderConstruct.getResourceName(props.target.name);
    const credentialsRole = RoleBuilderConstruct.getImportedResource(
      scope,
      RestApiIntegrationRole.name
    );

    let successfulIntegrationResponse = {
      statusCode: '200',
      responseTemplates: {
        'application/json': "$input.path('$.Items')",
      },
    };

    if (props.selectedFields) {
      successfulIntegrationResponse.responseTemplates['application/json'] = `
        #set($inputRoot = $input.path('$'))
        {
        "response": [
            #foreach($field in $inputRoot.Items) 
              ${JSON.stringify(props.selectedFields)}
              #if($foreach.hasNext),#end
            #end
          ]
        }
      `;
    }

    const integration = new AwsIntegration({
      service: 'dynamodb',
      action: 'Query',
      integrationHttpMethod: 'POST',
      options: {
        passthroughBehavior: PassthroughBehavior.WHEN_NO_TEMPLATES,
        credentialsRole,
        requestTemplates: {
          'application/json': JSON.stringify({
            TableName,
            ...props.query,
          }),
        },
        integrationResponses: [
          ...super.awsDefaultIntegrationResponses,
          successfulIntegrationResponse,
        ],
      },
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
    requestProps: RestApiRequestDynamoDbIntegrationsProps & {
      target: DynamoDbConstructType;
      query: Omit<QueryCommandInput, 'TableName'>;
      selectedFields?: Record<string, string>;
    }
  ) {
    return (scope: Construct, props: RestApiIntegrationProps) =>
      new RestApiDaynamoDbIntegration(scope, { ...props, ...requestProps });
  }
}

class RestApiEventBusIntegration extends RestApiBaseIntegration {
  constructor(scope: Construct, props: RestApiIntegrationProps & RestApiRequestIntegrationsProps) {
    super(scope, props);

    const EventBusName = EventBusBuilderConstruct.getResourceName(props.target.name);
    const credentialsRole = RoleBuilderConstruct.getImportedResource(
      scope,
      RestApiIntegrationRole.name
    );

    const integration = new AwsIntegration({
      service: 'events',
      action: 'PutEvents',
      integrationHttpMethod: 'POST',
      options: {
        credentialsRole,
        integrationResponses: [
          ...super.awsDefaultIntegrationResponses,
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': JSON.stringify({
                id: "$input.path('$.Entries[0].EventId')",
              }),
            },
          },
        ],
        requestTemplates: {
          'application/json': `
            #set($context.requestOverride.header.X-Amz-Target = "AWSEvents.PutEvents")
            #set($context.requestOverride.header.Content-Type = "application/x-amz-json-1.1")
            ${JSON.stringify({
              Entries: [
                {
                  Detail:
                    '{ "index": $context.requestTimeEpoch,"message": $util.escapeJavaScript($input.json(\'$\')) }',
                  DetailType: 'GIFT_REDEEMED',
                  EventBusName,
                  Source: props.apiEventSource,
                },
              ],
            })}
          `,
        },
      },
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

  static setup(requestProps: RestApiRequestIntegrationsProps & { target: EventBusConstructType }) {
    return (scope: Construct, props: RestApiIntegrationProps) =>
      new RestApiEventBusIntegration(scope, { ...props, ...requestProps });
  }
}

export const RestApiIntegration = {
  StateMachine: RestApiSfnIntegration.setup,
  EventBridge: RestApiEventBusIntegration.setup,
  DynamoDb: RestApiDaynamoDbIntegration.setup,
  Lambda: RestApiLambdaIntegration.setup,
};
