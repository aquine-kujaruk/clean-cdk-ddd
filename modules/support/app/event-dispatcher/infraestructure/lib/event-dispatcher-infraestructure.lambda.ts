import { BookLambda } from '@modules/core/app/book/infraestructure/lib/book.lambda';
import { CreateBookStateMachine } from '@modules/core/app/book/infraestructure/lib/state-machines/create-book.state-machine';
import { NodejsFunctionBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/nodejs-function.builder';
import { getConstructName } from '@modules/shared/app/infraestructure/lib/construct-utils/resource-names';
import { EventStoreTable } from '@modules/shared/app/infraestructure/lib/stateful-resources/databases/dynamo-db/event-store.table';
import { Duration } from 'aws-cdk-lib';
import { EventSourceMapping, Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';
import { AppEventsQueue } from './app-events.queue';

export class EventDispatcherInfraestructureLambda extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct) {
    super(scope, EventDispatcherInfraestructureLambda.name, {
      entry: path.resolve(__dirname, '../src/adapters/event-dispatcher-infraestructure.adapter.ts'),
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
        getConstructName(`${EventDispatcherInfraestructureLambda.name}Target`),
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
