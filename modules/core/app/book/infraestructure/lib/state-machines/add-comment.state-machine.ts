import { StateMachineBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/state-machine.builder';
import { Construct } from 'constructs';
import { AddCommentDefinition } from '../../../application/lib/use-cases/add-comment.definition';

export class AddCommentStateMachine extends StateMachineBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, AddCommentStateMachine.name, {
      definitionJob: AddCommentDefinition,
    });

    super.build();
  }
}
