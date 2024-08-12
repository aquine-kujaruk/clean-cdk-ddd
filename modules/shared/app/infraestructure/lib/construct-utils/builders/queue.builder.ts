import { Stack } from 'aws-cdk-lib';
import { IQueue, Queue, QueueProps } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import _ from 'lodash';
import { getConstructName, getStatelessResourceName, getUniqueConstructName } from '../resource-names';
import { BaseBuilder } from './base.builder';

export class QueueBuilderConstruct extends BaseBuilder<QueueProps> {
  public queue: Queue;

  constructor(scope: Construct, name: string, props: QueueProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getStatelessResourceName(this.name);
  }

  public static getArn(scope: Construct): string {
    const { region, account } = Stack.of(scope);
    return `arn:aws:sqs:${region}:${account}:${this.resourceName}`;
  }

  public static getImportedResource(scope: Construct): IQueue {
    return Queue.fromQueueArn(
      scope,
      getUniqueConstructName(this.name),
      this.getArn(scope)
    );
  }

  public build() {
    this.queue = new Queue(
      this,
      getConstructName(this.name),
      _.merge(
        {
          queueName: getStatelessResourceName(this.name),
        } as Partial<QueueProps>,
        this.props
      )
    );
  }
}
