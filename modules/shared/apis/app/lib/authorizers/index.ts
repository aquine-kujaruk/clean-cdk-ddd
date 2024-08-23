import { AuthorizerFunctionConstruct } from '@modules/common/app/lib/constructs/api-gateway/authorizer-function.construct';
import { Construct } from 'constructs';
// import { SimpleAuthorizer } from './simple.authorizer';

export class Authorizers {
  public readonly authorizers: AuthorizerFunctionConstruct[];

  constructor(scope: Construct) {
    this.authorizers = [/* new SimpleAuthorizer(scope) */];
  }
}
