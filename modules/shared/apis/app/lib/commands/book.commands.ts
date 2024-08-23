import { AddCommentStateMachine } from '@modules/books/app/lib/state-machines/add-comment.state-machine';
import { CreateBookStateMachine } from '@modules/books/app/lib/state-machines/create-book.state-machine';
import { StateMachineIntegration } from '@modules/common/app/lib/constructs/api-gateway/integrations/';
import { CommandQueryType } from '@modules/common/app/lib/constructs/api-gateway/rest-api.types';
import { PublicApi } from '../apis/public.api';

export const BookCommands: CommandQueryType = {
  resource: 'book',
  endpointDefinitions: [
    {
      path: 'POST /create-book',
      apis: [PublicApi],
      integration: StateMachineIntegration({
        target: CreateBookStateMachine,
        // authorizer: SimpleAuthorizer,
      }),
    },
    {
      path: 'POST /add-comment/{bookId}',
      apis: [PublicApi],
      integration: StateMachineIntegration({ target: AddCommentStateMachine }),
    },
  ],
};
