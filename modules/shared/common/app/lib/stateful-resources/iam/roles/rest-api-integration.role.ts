import { RoleBuilderConstruct } from '../../../construct-utils/builders/role.builder';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class RestApiIntegrationRole extends RoleBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, RestApiIntegrationRole.name, {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
      inlinePolicies: {
        customPolycies: new PolicyDocument({
          statements: [
            new PolicyStatement({
              resources: ['*'],
              actions: [
                'dynamodb:PutItem',
                'dynamodb:GetItem',
                'dynamodb:DeleteItem',
                'dynamodb:Query',
                'events:PutEvents',
              ],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });
  }
}
