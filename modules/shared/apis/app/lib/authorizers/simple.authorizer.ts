import { NodejsFunctionBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/nodejs-function.builder';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';

export class SimpleAuthorizer extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct) {
    super(scope, SimpleAuthorizer.name, {
      entry: path.resolve(__dirname, '../../src/infraestructure/handlers/simple-authorizer.handler.ts'),
    });
  }
}
