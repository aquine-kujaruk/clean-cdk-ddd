import { NodejsFunctionBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/nodejs-function.builder';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class ApiAuthorizersInfraestructureLambda extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct) {
    super(scope, ApiAuthorizersInfraestructureLambda.name, {
      entry: `${__dirname}/code/index.ts`,
    });

    super.build();
  }
}
