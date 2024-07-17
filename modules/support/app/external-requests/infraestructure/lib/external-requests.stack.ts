import { Construct } from 'constructs';
import { ApiAuthorizersInfraestructureLambda } from './simple-authorizer.lambda';
import { PublicApi } from './public.api';
import { NestedStack } from 'aws-cdk-lib';

export class ExternalRequests extends NestedStack {
  constructor(scope: Construct) {
    super(scope, ExternalRequests.name);

    const authorizer = new ApiAuthorizersInfraestructureLambda(scope);
    const publicApi = new PublicApi(scope);

    publicApi.node.addDependency(authorizer);
  }
}
