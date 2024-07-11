import { QueueBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/queue.builder';
import { Duration } from 'aws-cdk-lib';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

class DlqAppEventsQueue extends QueueBuilderConstruct {
  public queue: Queue;

  constructor(scope: Construct) {
    super(scope, DlqAppEventsQueue.name, {
      retentionPeriod: Duration.days(14),
    });

    this.queue = this.build();
  }
}

export class AppEventsQueue extends QueueBuilderConstruct {
  constructor(scope: Construct) {
    const dlQueue = new DlqAppEventsQueue(scope).queue;

    super(scope, AppEventsQueue.name, {
      receiveMessageWaitTime: Duration.seconds(5),
      visibilityTimeout: Duration.minutes(1),
      deadLetterQueue: {
        maxReceiveCount: 5,
        queue: dlQueue,
      },
    });

    this.build();
  }
}
