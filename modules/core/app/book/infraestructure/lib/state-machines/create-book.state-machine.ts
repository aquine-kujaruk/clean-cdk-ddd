import { StateMachineBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/state-machine.builder';
import { Construct } from 'constructs';
import { CreateBookDefinition } from '../../../application/use-cases/create-book.definition';

export class CreateBookStateMachine extends StateMachineBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, CreateBookStateMachine.name, {
      definitionJob: CreateBookDefinition,
    });

    super.build();
  }
}
