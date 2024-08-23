import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { AwsIntegration, Model, PassthroughBehavior } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { BaseIntegration } from './base.integration';

import {
  RestApiIntegrationProps,
  RestApiRequestDynamoDbIntegrationsProps,
} from '../rest-api.types';
import { TableConstructType } from '../../construct.types';
import { RestApiIntegrationRole } from '../../../resources/iam/roles/rest-api-integration.role';

class DynamoDbIntegration extends BaseIntegration {
  private constructor(
    scope: Construct,
    props: RestApiIntegrationProps & RestApiRequestDynamoDbIntegrationsProps
  ) {
    super(scope, props);

    const TableName = (props.target as any).resourceName;
    const credentialsRole = RestApiIntegrationRole.getImportedResource(scope);

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
      target: TableConstructType;
      query: Omit<QueryCommandInput, 'TableName'>;
      selectedFields?: Record<string, string>;
    }
  ) {
    return (scope: Construct, props: RestApiIntegrationProps) =>
      new DynamoDbIntegration(scope, { ...props, ...requestProps });
  }
}

export default DynamoDbIntegration.setup;
