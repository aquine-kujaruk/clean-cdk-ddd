import { Configurations } from '@modules/shared/configurations';
import { NestedStack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BookDomainLambda } from './book-domain.lambda';
import { BookInfraestructureLambda } from './book-infraestructure.lambda';
import { CreateBookStateMachine } from './state-machines/create-book.state-machine';

const { STAGE } = Configurations.getEnvs();

export class BookStack extends NestedStack {
  constructor(scope: Construct) {
    super(scope, BookStack.name);

    const commonEnvironment = { ENV: STAGE };

    new BookDomainLambda(this, { environment: commonEnvironment });
    new BookInfraestructureLambda(this, { environment: commonEnvironment });
    new CreateBookStateMachine(scope);
  }
}
