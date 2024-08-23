import { Construct } from 'constructs';
import { CommonLambda } from './functions/common.lambda';
import { SimpleAuthorizerLambda } from './functions/simple-authorizer.lambda';

export class Lambda {
  constructor(scope: Construct) {
    new CommonLambda(scope);
    new SimpleAuthorizerLambda(scope);
  }
}
