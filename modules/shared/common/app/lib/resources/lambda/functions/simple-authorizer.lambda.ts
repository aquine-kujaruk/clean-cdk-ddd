import { NodejsFunctionConstruct } from '@modules/common/app/lib/constructs/lambda/nodejs-function.construct';
import { Construct } from 'constructs';
import path from 'path';

export class SimpleAuthorizerLambda extends NodejsFunctionConstruct {
  constructor(scope: Construct) {
    super(scope, SimpleAuthorizerLambda.name, {
      entry: path.resolve(
        __dirname,
        '../../../../src/infraestructure/handlers/simple-authorizer.handler.ts'
      ),
    });
  }
}
