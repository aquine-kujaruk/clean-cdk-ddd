import { StateMachineConstruct } from '@modules/common/app/lib/constructs/step-functions/state-machine.construct';
import { Construct } from 'constructs';
import { CreateBookDefinition } from '../../src/application/use-cases/create-book.definition';

export class CreateBookStateMachine extends StateMachineConstruct {
  constructor(scope: Construct) {
    super(scope, CreateBookStateMachine.name, {
      definitionJob: CreateBookDefinition,
    });
  }
}
