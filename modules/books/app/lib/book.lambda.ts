import { NodejsFunctionBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/nodejs-function.builder';
import { BookTable } from '@modules/common/app/lib/resources/databases/dynamo-db/book.table';
import { DomainEventsBus } from '@modules/common/app/lib/resources/event-bridge/busses/domain-events.bus';
import { Duration } from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';

interface BookLambdaProps {
  environment?: Record<string, string>;
}

export class BookLambda extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct, props: BookLambdaProps) {
    super(scope, BookLambda.name, {
      entry: path.resolve(__dirname, '../src/infraestructure/handlers/book.handler.ts'),
      environment: {
        ...props.environment,
        BOOK_TABLE_NAME: BookTable.resourceName,
        APP_EVENT_BUS_NAME: DomainEventsBus.resourceName,
      },
      timeout: Duration.seconds(30)
    });
  }
}
