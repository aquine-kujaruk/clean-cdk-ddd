import { Construct } from 'constructs';
import { SimpleAuthorizerLambda } from './simple-authorizer.lambda';

export class LambdaFunctions {
  constructor(scope: Construct) {
    new SimpleAuthorizerLambda(scope);
  }
}
