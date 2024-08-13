import { LogGroupBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/log-group.builder';
import { RuleBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/rule.builder';
import { CloudWatchLogGroup, SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { RulesProps } from '.';
import { AppEventSources } from '../../app.event-sources';
import { AppEvents } from '../../app.events';

export class AppEventsRule extends RuleBuilderConstruct {
  constructor(scope: Construct, props: RulesProps) {
    super(scope, AppEventsRule.name, {
      eventBus: props.bus,
      eventPattern: {
        source: Object.values(AppEventSources),
        detailType: Object.values(AppEvents),
      },
      targets: AppEventsRule.getTargets(scope, props),
    });
  }

  private static getTargets = (scope: Construct, props: RulesProps) => {
    const { logGroup } = new LogGroupBuilderConstruct(scope, `/aws/events/${AppEventsRule.name}`);

    return [new SqsQueue(props.queue), new CloudWatchLogGroup(logGroup)];
  };
}
