import { StateMachineBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/state-machine.builder';
import { Construct } from 'constructs';
import { AddCommentDefinition } from '../use-cases/add-comment.definition';

export class AddCommentStateMachine extends StateMachineBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, AddCommentStateMachine.name, {
      definitionJob: AddCommentDefinition,
    });
  }
}