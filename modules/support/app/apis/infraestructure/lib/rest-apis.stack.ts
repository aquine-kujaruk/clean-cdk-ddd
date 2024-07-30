import { Construct } from 'constructs';
import { SimpleAuthorizer } from './simple-authorizer.lambda';
import { PublicApi } from './public.api';
import { NestedStack } from 'aws-cdk-lib';

export class RestApis extends NestedStack {
  constructor(scope: Construct) {
    super(scope, RestApis.name);

    const authorizer = new SimpleAuthorizer(scope);
    const publicApi = new PublicApi(scope);

    publicApi.node.addDependency(authorizer);
  }
}
