import { LambdaBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/lambda.builder';
import { StateMachineBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/state-machine.builder';
import {
  AwsIntegration,
  IResource,
  LambdaIntegration,
  MethodOptions,
  Model,
  StepFunctionsIntegration,
} from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { DynamoDbBuilderConstruct } from '../builders/dynamo-db.builder';
import { EventBusBuilderConstruct } from '../builders/event-bus.builder';
import { RoleBuilderConstruct } from '../builders/role.builder';
import {
  DynamoDbConstructType,
  EventBusConstructType,
  LambdaConstructType,
  StateMachineConstructType,
} from '../construct.types';
import { RestApiIntegrationProps, RestApiRequestIntegrationsProps } from './rest-api.types';
import { RestApiIntegrationRole } from '../../stateful-resources/iam/roles/rest-api-integration.role';

export abstract class RestApiIntegration {
  protected handler: IStateMachine | IFunction;

  constructor(
    protected readonly scope: Construct,
    protected readonly props: RestApiIntegrationProps
  ) {}

  protected addMethod(integration: AwsIntegration, options?: MethodOptions) {
    const pathArray = this.props.path.split('/');
    let apiResource: IResource | undefined;

    for (const resourceString of pathArray) {
      if (apiResource) apiResource = apiResource.getResource(resourceString);
      else apiResource = this.props.api.root.getResource(resourceString);
    }

    apiResource?.addMethod(this.props.httpMethod, integration);
  }
}

export class RestApiSfnIntegration extends RestApiIntegration {
  constructor(scope: Construct, props: RestApiIntegrationProps & RestApiRequestIntegrationsProps) {
    super(scope, props);

    const handler = StateMachineBuilderConstruct.getImportedResource(this.scope, props.target.name);

    const integration = StepFunctionsIntegration.startExecution(handler);
    this.addMethod(integration);
  }

  static build(
    requestProps: RestApiRequestIntegrationsProps & { target: StateMachineConstructType }
  ) {
    return (scope: Construct, props: RestApiIntegrationProps) =>
      new RestApiSfnIntegration(scope, { ...props, ...requestProps });
  }
}

export class RestApiLambdaIntegration extends RestApiIntegration {
  constructor(scope: Construct, props: RestApiIntegrationProps & RestApiRequestIntegrationsProps) {
    super(scope, props);

    const handler = LambdaBuilderConstruct.getImportedResource(this.scope, props.target.name);

    const integration = new LambdaIntegration(handler);
    this.addMethod(integration);
  }

  static build(requestProps: RestApiRequestIntegrationsProps & { target: LambdaConstructType }) {
    return (scope: Construct, props: RestApiIntegrationProps) =>
      new RestApiLambdaIntegration(scope, { ...props, ...requestProps });
  }
}

// https://dev.to/aws-builders/look-ma-no-lambda-lambdaless-apigateway-and-dynamodb-integration-with-cdk-2hbd
export class RestApiDaynamoDbIntegration extends RestApiIntegration {
  constructor(scope: Construct, props: RestApiIntegrationProps & RestApiRequestIntegrationsProps) {
    super(scope, props);

    const TableName = DynamoDbBuilderConstruct.getResourceName(props.target.name);
    const credentialsRole = RoleBuilderConstruct.getImportedResource(
      scope,
      RestApiIntegrationRole.name
    );

    const integration = new AwsIntegration({
      service: 'dynamodb',
      action: 'GetItem',
      options: {
        credentialsRole,
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': `
                #set($inputRoot = $input.path('$'))
                #if($inputRoot.Item.size() == 0)
                  #set($context.responseOverride.status = 404)
                  { "message": "Item not found" }
                #else
                  #set($context.responseOverride.status = 200)
                  $input.json('$')
                #end
            `,
            },
          },
          {
            selectionPattern: '400',
            statusCode: '400',
            responseTemplates: { 'application/json': `{ "error": "Bad input!" }` },
          },
          {
            selectionPattern: '5\\d{2}',
            statusCode: '500',
            responseTemplates: { 'application/json': `{ "error": "Internal Service Error!" }` },
          },
        ],
        requestTemplates: {
          'application/json': JSON.stringify({
            TableName,
            Key: {
              id: { S: '$method.request.path.userId' },
            },
          }),
        },
      },
    });

    this.addMethod(integration, {
      methodResponses: [
        {
          statusCode: '200',
          responseModels: {
            'application/json': Model.EMPTY_MODEL,
          },
        },
        { statusCode: '400' },
        { statusCode: '500' },
      ],
    });
  }

  static build(requestProps: RestApiRequestIntegrationsProps & { target: DynamoDbConstructType }) {
    return (scope: Construct, props: RestApiIntegrationProps) =>
      new RestApiDaynamoDbIntegration(scope, { ...props, ...requestProps });
  }
}

export class RestApiEventBusIntegration extends RestApiIntegration {
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
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': JSON.stringify({
                id: "$input.path('$.Entries[0].EventId')",
              }),
            },
          },
          {
            statusCode: '400',
            selectionPattern: '4\\d{2}',
            responseTemplates: {
              'application/json': JSON.stringify({ message: 'Bad request' }),
            },
          },
          {
            statusCode: '500',
            selectionPattern: '5\\d{2}',
            responseTemplates: {
              'application/json': JSON.stringify({ message: 'Internal server error' }),
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
                  Detail: "$util.escapeJavaScript($input.json('$'))",
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

    this.addMethod(integration, {
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

  static build(requestProps: RestApiRequestIntegrationsProps & { target: EventBusConstructType }) {
    return (scope: Construct, props: RestApiIntegrationProps) =>
      new RestApiEventBusIntegration(scope, { ...props, ...requestProps });
  }
}
