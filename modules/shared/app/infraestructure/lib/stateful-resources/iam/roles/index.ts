import { Construct } from 'constructs';
import { LambdaRole } from './lambda.role';
import { RestApiIntegrationRole } from './rest-api-integration.role';
import { StateMachineRole } from './state-machine.role';

export class Roles {
  constructor(scope: Construct) {
    new LambdaRole(scope);
    new StateMachineRole(scope);
    new RestApiIntegrationRole(scope);
  }
}
