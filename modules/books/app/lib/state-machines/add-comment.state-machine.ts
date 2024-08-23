import { StateMachineConstruct } from '@modules/common/app/lib/constructs/step-functions/state-machine.construct';
import { Construct } from 'constructs';
import { AddCommentDefinition } from '../../src/application/use-cases/add-comment.definition';

export class AddCommentStateMachine extends StateMachineConstruct {
  constructor(scope: Construct) {
    super(scope, AddCommentStateMachine.name, {
      definitionJob: AddCommentDefinition,
    });
  }
}
