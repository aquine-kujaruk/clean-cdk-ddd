import { NodejsFunctionConstruct } from '@modules/common/app/lib/constructs/lambda/nodejs-function.construct';
import { DomainEventsBus } from '@modules/common/app/lib/resources/event-bridge/busses/domain-events.bus';
import { Duration } from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';
import { BookTable } from '@modules/common/app/lib/resources/dynamo-db/tables/book.table';

interface BookLambdaProps {
  environment?: Record<string, string>;
}

export class BookLambda extends NodejsFunctionConstruct {
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
