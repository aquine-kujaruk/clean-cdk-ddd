import { StateMachineConstruct } from '@modules/common/app/lib/constructs/step-functions/state-machine.construct';
import { Construct } from 'constructs';
import { AddManyCommentDefinition } from '../../src/application/use-cases/add-many-comments.definition';

export class AddManyCommentStateMachine extends StateMachineConstruct {
  constructor(scope: Construct) {
    super(scope, AddManyCommentStateMachine.name, {
      definitionJob: AddManyCommentDefinition,
    });
  }
}
