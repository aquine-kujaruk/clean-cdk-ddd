import { Configurations } from '@modules/shared/configurations';
import { NestedStack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BookLambda } from './book.lambda';
import { AddCommentStateMachine } from './state-machines/add-comment.state-machine';
import { CreateBookStateMachine } from './state-machines/create-book.state-machine';

const { STAGE } = Configurations.getEnvs();

export class BookStack extends NestedStack {
  constructor(scope: Construct) {
    super(scope, BookStack.name);

    const commonEnvironment = { ENV: STAGE };

    new BookLambda(this, { environment: commonEnvironment });

    new CreateBookStateMachine(scope);
    new AddCommentStateMachine(scope);
  }
}
