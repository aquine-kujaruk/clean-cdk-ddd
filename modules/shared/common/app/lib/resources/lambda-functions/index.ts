import { Construct } from 'constructs';
import { CommonLambda } from './common.lambda';

export class LambdaFunctions {
  constructor(scope: Construct) {
    new CommonLambda(scope);
  }
}
