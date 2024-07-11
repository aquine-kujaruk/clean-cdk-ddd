import { Configurations } from '@packages/shared/configurations';
import { NestedStack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { UserApplication } from './src/application';
import { UserDomainLambda } from './src/domain/user-domain.lambda';
import { UserInfraestructureLambda } from './src/infraestructure/user-infraestructure.lambda';

const { STAGE } = Configurations.getEnvs();

export class User extends NestedStack {
  constructor(scope: Construct) {
    super(scope, User.name);

    const commonEnvironment = { ENV: STAGE };

    new UserApplication(this, { environment: commonEnvironment });
    new UserDomainLambda(this, { environment: commonEnvironment });
    new UserInfraestructureLambda(this, { environment: commonEnvironment });
  }
}
