import { NodejsFunctionConstruct } from '../../../constructs/lambda/nodejs-function.construct';
import { Construct } from 'constructs';
import path from 'path';

export class CommonLambda extends NodejsFunctionConstruct {
  constructor(scope: Construct) {
    super(scope, CommonLambda.name, {
      entry: path.resolve(__dirname, '../../../../src/infraestructure/handlers/common.handler.ts'),
    });
  }
}
