import { NodejsFunctionBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/nodejs-function.builder';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';

export class ApiAuthorizersInfraestructureLambda extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct) {
    super(scope, ApiAuthorizersInfraestructureLambda.name, {
      entry: path.resolve(__dirname, '../src/adapter/simple-authorizer.handler.ts'),
    });

    super.build();
  }
}
