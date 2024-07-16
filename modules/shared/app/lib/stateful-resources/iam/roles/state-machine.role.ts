import { RoleBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/role.builder';
import { Effect, PolicyDocument, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class StateMachineRole extends RoleBuilderConstruct {
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
