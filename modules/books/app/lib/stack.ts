import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Configurations } from '../../../shared/configurations';
import { BookLambda } from './book.lambda';
import { AddCommentStateMachine } from './state-machines/add-comment.state-machine';
import { CreateBookStateMachine } from './state-machines/create-book.state-machine';
import { AddManyCommentStateMachine } from './state-machines/add-many-comment.state-machine';

const { STAGE } = Configurations.getEnvs();

export class BookStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const commonEnvironment = { ENV: STAGE };

    new BookLambda(this, { environment: commonEnvironment });

    new CreateBookStateMachine(this);
    new AddCommentStateMachine(this);
    new AddManyCommentStateMachine(this);
  }
}
