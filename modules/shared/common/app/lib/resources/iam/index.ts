import { Construct } from 'constructs';
import { LambdaRole } from './roles/lambda.role';
import { RestApiIntegrationRole } from './roles/rest-api-integration.role';
import { StateMachineRole } from './roles/state-machine.role';
import { EcsTaskRole } from './roles/ecs-task.role';

export class Iam {
  constructor(scope: Construct) {
    new LambdaRole(scope);
    new StateMachineRole(scope);
    new RestApiIntegrationRole(scope);
    new EcsTaskRole(scope);
  }
}
