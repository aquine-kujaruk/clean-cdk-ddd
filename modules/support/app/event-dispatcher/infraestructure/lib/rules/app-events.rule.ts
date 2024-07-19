import { LogGroupBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/log-group.builder';
import { RuleBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/rule.builder';
import { CloudWatchLogGroup, SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { RulesProps } from '.';
import { AppEvents } from '../../app.events';
import { AppEventSources } from '../../app.event-sources';

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

    super.build();
  }

  private static getTargets = (scope: Construct, props: RulesProps) => {
    const logGroup = LogGroupBuilderConstruct.createResource(
      scope,
      `/aws/events/${AppEventsRule.name}`
    );

    return [
      new SqsQueue(props.queue),
      new CloudWatchLogGroup(logGroup),
    ];
  };
}
