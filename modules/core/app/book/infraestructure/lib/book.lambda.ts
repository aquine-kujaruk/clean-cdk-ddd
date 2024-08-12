import { NodejsFunctionBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/nodejs-function.builder';
import { BookTable } from '@modules/shared/app/infraestructure/lib/stateful-resources/databases/dynamo-db/book.table';
import { AppEventsBus } from '@modules/support/app/event-dispatcher/infraestructure/lib/app-events.bus';
import { Duration } from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';
import { CoreStackProps } from '../../../core.stack';

export class BookLambda extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct, props: CoreStackProps) {
    super(scope, BookLambda.name, {
      entry: path.resolve(__dirname, '../src/adapters/book.handler.ts'),
      environment: {
        ...props.environment,
        BOOK_TABLE_NAME: BookTable.resourceName,
        APP_EVENT_BUS_NAME: AppEventsBus.resourceName,
      },
      timeout: Duration.seconds(30),
      bundling: {
        nodeModules: ['@aws-sdk/util-dynamodb', 'uuid', 'dayjs'],
      },
    });
  }
}
