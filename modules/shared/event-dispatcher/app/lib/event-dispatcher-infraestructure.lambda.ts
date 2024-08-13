import { BookLambda } from '@modules/books/app/lib/book.lambda';
import { CreateBookStateMachine } from '@modules/books/app/lib/state-machines/create-book.state-machine';
import { NodejsFunctionBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/nodejs-function.builder';
import { getConstructName } from '@modules/common/app/lib/construct-utils/resource-names';
import { EventStoreTable } from '@modules/common/app/lib/stateful-resources/databases/dynamo-db/event-store.table';
import { Duration } from 'aws-cdk-lib';
import { EventSourceMapping, Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';
import { AppEventsQueue } from './app-events.queue';

export class EventDispatcherLambda extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct) {
    super(scope, EventDispatcherLambda.name, {
      entry: path.resolve(__dirname, '../src/handler.ts'),
      environment: {
        EVENT_STORE_TABLE_NAME: EventStoreTable.resourceName,
        DEFAULT_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
        CREATE_BOOK_STATE_MACHINE_ARN: CreateBookStateMachine.getArn(scope),
        BOOK_LAMBDA_NAME: BookLambda.resourceName,
      },
      timeout: Duration.seconds(30),
      bundling: {
        nodeModules: ['dayjs'],
      },
    });

    if (this.handler) {
      new EventSourceMapping(
        this,
        getConstructName(`${EventDispatcherLambda.name}Target`),
        {
          eventSourceArn: AppEventsQueue.getArn(this),
          target: this.handler,
          batchSize: 10,
          reportBatchItemFailures: true,
          maxConcurrency: 10,
        }
      );
    }
  }
}
