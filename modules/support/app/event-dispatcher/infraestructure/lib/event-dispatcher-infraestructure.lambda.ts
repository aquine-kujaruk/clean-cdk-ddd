import { BookLambda } from '@modules/core/app/book/infraestructure/lib/book.lambda';
import { CreateBookStateMachine } from '@modules/core/app/book/infraestructure/lib/state-machines/create-book.state-machine';
import { BaseBuilder } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/base.builder';
import { DynamoDbBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/dynamo-db.builder';
import { LambdaBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/lambda.builder';
import { NodejsFunctionBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/nodejs-function.builder';
import { QueueBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/queue.builder';
import { StateMachineBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/state-machine.builder';
import { EventStoreTable } from '@modules/shared/app/infraestructure/lib/stateful-resources/databases/dynamo-db/tables/event-store-table.table';
import { Duration } from 'aws-cdk-lib';
import { EventSourceMapping, Function, IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';
import { AppEventsQueue } from './app-events.queue';

export class EventDispatcherInfraestructureLambda extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct) {
    super(scope, EventDispatcherInfraestructureLambda.name, {
      entry: path.resolve(__dirname, '../src/adapters/event-dispatcher-infraestructure.adapter.ts'),
      environment: {
        EVENT_STORE_TABLE_NAME: DynamoDbBuilderConstruct.getResourceName(EventStoreTable.name),
        DEFAULT_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
        CREATE_BOOK_STATE_MACHINE_ARN: StateMachineBuilderConstruct.getArn(
          scope,
          CreateBookStateMachine.name
        ),
        BOOK_LAMBDA_NAME: LambdaBuilderConstruct.getResourceName(BookLambda.name),
      },
      timeout: Duration.seconds(30),
      bundling: {
        nodeModules: ['dayjs'],
      },
    });

    const target = super.build() as IFunction;

    if (target) {
      new EventSourceMapping(
        this,
        BaseBuilder.getConstructName(`${EventDispatcherInfraestructureLambda.name}Target`),
        {
          eventSourceArn: QueueBuilderConstruct.getArn(this, AppEventsQueue.name),
          target,
          batchSize: 10,
          reportBatchItemFailures: true,
          maxConcurrency: 10,
        }
      );
    }
  }
}
