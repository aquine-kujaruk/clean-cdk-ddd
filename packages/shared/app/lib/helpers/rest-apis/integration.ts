import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { LambdaBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/lambda.builder';
import { StateMachineBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/state-machine.builder';
import {
  AwsIntegration,
  IResource,
  LambdaIntegration,
  MethodOptions,
  Model,
  PassthroughBehavior,
  StepFunctionsIntegration,
} from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { RestApiIntegrationRole } from '../../stateful-resources/iam/roles/rest-api-integration.role';
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
} from './rest-api.types';

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

export class RestApiDaynamoDbIntegration extends RestApiIntegration {
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
          ...this.awsDefaultIntegrationResponses,
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': props.responseDefinition || "$input.path('$.Items')",
            },
          },
        ],
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

  static build(
    requestProps: RestApiRequestDynamoDbIntegrationsProps & {
      target: DynamoDbConstructType;
      query: Omit<QueryCommandInput, 'TableName'>;
      responseDefinition?: string;
    }
  ) {
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
          ...this.awsDefaultIntegrationResponses,
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
