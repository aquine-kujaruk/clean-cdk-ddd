import { NodejsFunctionBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/nodejs-function.builder';
import { Construct } from 'constructs';
import path from 'path';
import { CoreStackProps } from '../../../core.stack';

export class BookDomainLambda extends NodejsFunctionBuilderConstruct {
  constructor(scope: Construct, props: CoreStackProps) {
    super(scope, BookDomainLambda.name, {
      entry: path.resolve(__dirname, '../src/adapters/book-domain.handler.ts'),
      environment: props.environment,
    });

    super.build();
  }
}
