import { LambdaAuthorizerBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/lambda-authorizer.builder';
import { Construct } from 'constructs';
// import { SimpleAuthorizer } from './simple.authorizer';

export class Authorizers {
  public readonly authorizers: LambdaAuthorizerBuilderConstruct[];

  constructor(scope: Construct) {
    this.authorizers = [/* new SimpleAuthorizer(scope) */];
  }
}
