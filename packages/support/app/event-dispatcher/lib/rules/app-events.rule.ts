import { LogGroupBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/log-group.builder';
import { QueueBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/queue.builder';
import { RuleBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/rule.builder';
import { CloudWatchLogGroup, SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { RulesProps } from '.';
import { AppEventSources } from '../../appevent.event-sources';
import { AppEvents } from '../../app.events';
import { AppEventsQueue } from '../app-events.queue';

export class AppEventsRule extends RuleBuilderConstruct {
  constructor(scope: Construct, props: RulesProps) {
    super(scope, AppEventsRule.name, {
      eventBus: props.bus,
      eventPattern: {
        source: Object.values(AppEventSources),
        detailType: Object.values(AppEvents),
      },
      targets: AppEventsRule.getTargets(scope),
    });

    this.build();
  }

  private static getTargets = (scope: Construct) => {
    const logGroup = LogGroupBuilderConstruct.createResource(
      scope,
      `/aws/events/${AppEventsRule.name}`
    );

    return [
      new SqsQueue(QueueBuilderConstruct.getImportedResource(scope, AppEventsQueue.name)),
      new CloudWatchLogGroup(logGroup),
    ];
  };
}
