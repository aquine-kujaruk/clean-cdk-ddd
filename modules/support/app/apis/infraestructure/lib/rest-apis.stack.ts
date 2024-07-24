import { Construct } from 'constructs';
import { SimpleAuthorizer } from './simple-authorizer.lambda';
import { PublicApi } from './public.api';
import { NestedStack } from 'aws-cdk-lib';

export class restApis extends NestedStack {
  constructor(scope: Construct) {
    super(scope, restApis.name);

    const authorizer = new SimpleAuthorizer(scope);
    const publicApi = new PublicApi(scope);

    publicApi.node.addDependency(authorizer);
  }
}