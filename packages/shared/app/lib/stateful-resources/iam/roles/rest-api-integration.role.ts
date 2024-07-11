import { RoleBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/role.builder';
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
                'events:PutEvents',
              ],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    this.build();
  }
}
