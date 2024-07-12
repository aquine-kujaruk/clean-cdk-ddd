import { NodejsFunctionBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/nodejs-function.builder';
import { Construct } from 'constructs';
import { CoreStackProps } from '../../..';

export class UserDomainLambda extends NodejsFunctionBuilderConstruct {
  constructor(scope: Construct, props: CoreStackProps) {
    super(scope, UserDomainLambda.name, {
      entry: `${__dirname}/code/index.ts`,
      environment: props.environment,
    });

    this.build();
  }
}
