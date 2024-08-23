import { RoleConstruct } from '../../../constructs/iam/role.construct';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class StateMachineRole extends RoleConstruct {
  constructor(scope: Construct) {
    super(scope, StateMachineRole.name, {
      assumedBy: new ServicePrincipal('states.amazonaws.com'),
      inlinePolicies: {
        customPolycies: new PolicyDocument({
          statements: [
            new PolicyStatement({
              resources: ['*'],
              actions: [
                'sts:AssumeRole',
                'lambda:InvokeFunction',
                'logs:CreateLogDelivery',
                'logs:DeleteLogDelivery',
                'logs:DescribeLogGroups',
                'logs:DescribeResourcePolicies',
                'logs:GetLogDelivery',
                'logs:ListLogDeliveries',
                'logs:PutResourcePolicy',
                'logs:UpdateLogDelivery',
                'xray:GetSamplingRules',
                'xray:GetSamplingTargets',
                'xray:PutTelemetryRecords',
                'xray:PutTraceSegments',
                'states:StartExecution',
                'states:DescribeExecution',
                'states:StopExecution',
                'events:DescribeRule',
                'events:PutRule',
                'events:PutTargets',
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
              ],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });
  }
}
