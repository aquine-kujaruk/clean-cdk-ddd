import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SimpleAuthorizer } from './authorizers/simple.authorizer';
import { PublicApi } from './public.api';

export class ApisStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new SimpleAuthorizer(this);

    new PublicApi(this);
  }
}
