import { NodejsFunctionBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/nodejs-function.builder';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';

export class SimpleAuthorizer extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct) {
    super(scope, SimpleAuthorizer.name, {
      entry: path.resolve(__dirname, '../src/adapter/simple-authorizer.handler.ts'),
    });
  }
}
