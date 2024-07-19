import { RoleBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/role.builder';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class LambdaRole extends RoleBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, LambdaRole.name, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        customPolycies: new PolicyDocument({
          statements: [
            new PolicyStatement({
              resources: ['*'],
              actions: [
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
                's3:PutObjectAcl',
                's3:PutObjectVersionAcl',
                'dynamodb:*',
                'states:ListExecutions',
                'states:ListStateMachines',
                'states:SendTaskFailure',
                'states:SendTaskHeartbeat',
                'states:SendTaskSuccess',
                'states:StartExecution',
                'states:StartSyncExecution',
                'sqs:ChangeMessageVisibility',
                'sqs:DeleteMessage',
                'sqs:GetQueueAttributes',
                'sqs:GetQueueUrl',
                'sqs:ReceiveMessage',
                'sqs:SendMessage',
                'events:PutEvents',
                'secretsmanager:GetSecretValue',
                'secretsmanager:UpdateSecret',
                'ssm:GetParameter',
                'ssm:GetParameters',
                'ssm:GetParametersByPath',
                'logs:*',
              ],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    super.build();
  }
}
