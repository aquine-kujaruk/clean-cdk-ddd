import { IQueue, Queue, QueueProps } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import _ from 'lodash';
import { BaseBuilder } from './base.builder';

export class QueueBuilderConstruct extends BaseBuilder<Queue, QueueProps> {
  constructor(scope: Construct, id: string, props: QueueProps) {
    super(scope, id, props);
  }

  public static getResourceName(name: string): string {
    return this.getStatelessResourceName(name);
  }

  public static getArn(scope: Construct, name: string): string {
    const { region, account } = this.getStack(scope);
    return `arn:aws:sqs:${region}:${account}:${QueueBuilderConstruct.getResourceName(name)}`;
  }

  public static getImportedResource(scope: Construct, name: string): IQueue {
    const stack = this.getStack(scope);
    stack.getLogicalId;
    return Queue.fromQueueArn(
      scope,
      QueueBuilderConstruct.getUniqueConstructName(name),
      QueueBuilderConstruct.getArn(scope, name)
    );
  }

  public build(): Queue {
    const bucket = new Queue(
      this,
      QueueBuilderConstruct.getConstructName(this.id),
      _.merge(
        {
          queueName: QueueBuilderConstruct.getResourceName(this.id),
        } as Partial<QueueProps>,
        this.props
      )
    );

    return bucket;
  }
}
