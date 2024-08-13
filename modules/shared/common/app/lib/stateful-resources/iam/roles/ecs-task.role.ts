import { RoleBuilderConstruct } from '../../../construct-utils/builders/role.builder';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class EcsTaskRole extends RoleBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, EcsTaskRole.name, {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      inlinePolicies: {
        customPolycies: new PolicyDocument({
          statements: [
            new PolicyStatement({
              resources: ['*'],
              actions: [
                'logs:*',
                'cloudwatch:*',
                'sts:AssumeRole',
                's3:Abort*',
                's3:DeleteObject*',
                's3:GetBucket*',
                's3:GetObject*',
                's3:List*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
              ],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });
  }
}
