import { StateMachineBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/state-machine.builder';
import { Construct } from 'constructs';
import { CoreStackProps } from '../../../../../core.stack';
import Definition from './code';

export class CreateUserStateMachine extends StateMachineBuilderConstruct {
  constructor(scope: Construct, props: CoreStackProps) {
    super(scope, CreateUserStateMachine.name, {
      definitionJob: Definition,
    });

    this.build();
  }
}
