import { QueueConstruct } from '@modules/common/app/lib/constructs/sqs/queue.construct';
import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';

class DlqDomainEventsQueue extends QueueConstruct {
  constructor(scope: Construct) {
    super(scope, DlqDomainEventsQueue.name, {
      retentionPeriod: Duration.days(14),
    });
  }
}

export class DomainEventsQueue extends QueueConstruct {
  constructor(scope: Construct) {
    const dlQueue = new DlqDomainEventsQueue(scope).queue;

    super(scope, DomainEventsQueue.name, {
      receiveMessageWaitTime: Duration.seconds(5),
      visibilityTimeout: Duration.minutes(1),
      deadLetterQueue: {
        maxReceiveCount: 5,
        queue: dlQueue,
      },
    });
  }
}
