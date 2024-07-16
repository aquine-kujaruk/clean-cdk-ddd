import { StateMachineBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/state-machine.builder';
import { Construct } from 'constructs';
import { CoreStackProps } from '../../../../..';
import Definition from './code';

export class CreateUserStateMachine extends StateMachineBuilderConstruct {
  constructor(scope: Construct, props: CoreStackProps) {
    super(scope, CreateUserStateMachine.name, {
      definitionJob: Definition,
    });

    super.build();
  }
}
