import { AwsIntegration, Model } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { RestApiIntegrationRole } from '../../resources/iam/roles/rest-api-integration.role';
import { EventBusConstructType } from '../types/construct.types';
import {
  RestApiIntegrationProps,
  RestApiRequestEventBusIntegrationsProps,
} from '../types/rest-api.types';
import { BaseIntegration } from './base.integration';

class EventBusIntegration extends BaseIntegration {
  private constructor(
    scope: Construct,
    props: RestApiIntegrationProps & RestApiRequestEventBusIntegrationsProps
  ) {
    super(scope, props);

    const EventBusName = (props.target as any).resourceName;
    const credentialsRole = RestApiIntegrationRole.getImportedResource(scope);

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
                    DetailType: props.eventType,
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

  static setup(
    requestProps: RestApiRequestEventBusIntegrationsProps & { target: EventBusConstructType }
  ) {
    return (scope: Construct, props: RestApiIntegrationProps) =>
      new EventBusIntegration(scope, { ...props, ...requestProps });
  }
}

export default EventBusIntegration.setup;
