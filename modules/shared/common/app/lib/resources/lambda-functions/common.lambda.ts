import { NodejsFunctionBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/nodejs-function.builder';
import { Construct } from 'constructs';
import path from 'path';

export class CommonLambda extends NodejsFunctionBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, CommonLambda.name, {
      entry: path.resolve(__dirname, '../../../src/infraestructure/handlers/common.handler.ts'),
    });
  }
}
