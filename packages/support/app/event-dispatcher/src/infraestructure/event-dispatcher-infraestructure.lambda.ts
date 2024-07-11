import { CreateUserStateMachine } from '@packages/core/app/user/src/application/use-cases/create-user/create-user.state-machine';
import { BaseBuilder } from '@packages/shared/app/lib/helpers/builders/base.builder';
import { DynamoDbBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/dynamo-db.builder';
import { NodejsFunctionBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/nodejs-function.builder';
import { QueueBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/queue.builder';
import { StateMachineBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/state-machine.builder';
import { EventStoreTable } from '@packages/shared/app/lib/stateful-resources/databases/dynamo-db/tables/event-store-table.table';
import { Duration } from 'aws-cdk-lib';
import { EventSourceMapping, Function, IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { AppEventsQueue } from '../../lib/app-events.queue';

export class EventDispatcherInfraestructureLambda extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct) {
    super(scope, EventDispatcherInfraestructureLambda.name, {
      entry: `${__dirname}/code/index.ts`,
      environment: {
        EVENT_STORE_TABLE_NAME: DynamoDbBuilderConstruct.getResourceName(EventStoreTable.name),
        DEFAULT_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
        CREATE_USER_STATE_MACHINE_ARN: StateMachineBuilderConstruct.getArn(
          scope,
          CreateUserStateMachine.name
        ),
      },
      timeout: Duration.seconds(30),
      bundling: {
        nodeModules: ['dayjs'],
      },
    });

    const target = this.build() as IFunction;

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
