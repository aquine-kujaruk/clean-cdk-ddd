import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PublicApi } from './public.api';
import { SimpleAuthorizer } from './simple-authorizer.lambda';

export class RestApisStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const authorizer = new SimpleAuthorizer(this);
    const publicApi = new PublicApi(this);

    publicApi.node.addDependency(authorizer);
  }
}
