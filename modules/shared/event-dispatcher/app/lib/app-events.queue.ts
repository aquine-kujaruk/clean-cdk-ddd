import { QueueBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/queue.builder';
import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';

class DlqAppEventsQueue extends QueueBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, DlqAppEventsQueue.name, {
      retentionPeriod: Duration.days(14),
    });
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
  }
}
