import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BackOfficeEcsFargate } from './back-office.ecs-fargate-service';

export class BackOfficeStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new BackOfficeEcsFargate(this);
  }
}
