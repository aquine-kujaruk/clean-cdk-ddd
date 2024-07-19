import { QueueBuilderConstruct } from '@modules/shared/app/lib/construct-utils/builders/queue.builder';
import { Duration } from 'aws-cdk-lib';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

class DlqAppEventsQueue extends QueueBuilderConstruct {
  public queue: Queue;

  constructor(scope: Construct) {
    super(scope, DlqAppEventsQueue.name, {
      retentionPeriod: Duration.days(14),
    });

    this.queue = super.build();
  }
}

export class AppEventsQueue extends QueueBuilderConstruct {
  public readonly queue: Queue;

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

    this.queue = super.build();
  }
}
