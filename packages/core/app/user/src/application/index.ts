import { Construct } from 'constructs';
import { CreateUserStateMachine } from './use-cases/create-user/create-user.state-machine';
import { CoreStackProps } from '../../../core.stack';

export class UserApplication {
  constructor(scope: Construct, props: CoreStackProps) {
    new CreateUserStateMachine(scope, props);
  }
}
