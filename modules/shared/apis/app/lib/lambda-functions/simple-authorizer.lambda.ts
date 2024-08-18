import { NodejsFunctionBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/nodejs-function.builder';
import { Construct } from 'constructs';
import path from 'path';

export class SimpleAuthorizerLambda extends NodejsFunctionBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, SimpleAuthorizerLambda.name, {
      entry: path.resolve(
        __dirname,
        '../../src/infraestructure/handlers/simple-authorizer.handler.ts'
      ),
    });
  }
}
