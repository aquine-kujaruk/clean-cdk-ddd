import { BookLambda } from '@modules/books/app/lib/book.lambda';
import { CreateBookStateMachine } from '@modules/books/app/lib/state-machines/create-book.state-machine';
import { NodejsFunctionConstruct } from '@modules/common/app/lib/constructs/lambda/nodejs-function.construct';
import { getConstructName } from '@modules/common/app/lib/constructs/resource-names.util';
import { EventStoreTable } from '@modules/common/app/lib/resources/dynamo-db/tables/event-store.table';
import { Duration } from 'aws-cdk-lib';
import { EventSourceMapping, Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';
import { DomainEventsQueue } from './domain-events.queue';

export class DomainEventsLambda extends NodejsFunctionConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct) {
    super(scope, DomainEventsLambda.name, {
      entry: path.resolve(__dirname, '../src/infraestructure/handlers/domain-events.handler.ts'),
      environment: {
        EVENT_STORE_TABLE_NAME: EventStoreTable.resourceName,
        CREATE_BOOK_USE_CASE: CreateBookStateMachine.getArn(scope),
        BOOK_HANDLER: BookLambda.resourceName,
      },
      timeout: Duration.seconds(30),
    });

    if (this.handler) {
      new EventSourceMapping(this, getConstructName(`${DomainEventsLambda.name}Target`), {
        eventSourceArn: DomainEventsQueue.getArn(this),
        target: this.handler,
        batchSize: 10,
        reportBatchItemFailures: true,
        maxConcurrency: 10,
      });
    }
  }
}
