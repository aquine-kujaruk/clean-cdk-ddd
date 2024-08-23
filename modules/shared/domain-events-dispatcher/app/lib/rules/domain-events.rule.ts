import { LogGroupConstruct } from '@modules/common/app/lib/constructs/cloud-watch/log-group.construct';
import { RuleConstruct } from '@modules/common/app/lib/constructs/event-bridge/rule.construct';
import { DomainEventsBus } from '@modules/common/app/lib/resources/event-bridge/busses/domain-events.bus';
import { IDomainEvent } from '@modules/common/app/src/domain/events/base.domain-event';
import { CloudWatchLogGroup, SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { RulesProps } from '.';
import { DomainEventSources } from '../../domain-event.sources';
import { DomainEvents } from '../../src/domain/domain-events';

export class DomainEventsRule extends RuleConstruct {
  constructor(scope: Construct, props: RulesProps) {
    const detailTypes = DomainEvents.map(
      (event: IDomainEvent<DomainEventSources>) => (event as any).type
    );

    super(scope, DomainEventsRule.name, {
      eventBus: DomainEventsBus.getImportedResource(scope),
      eventPattern: {
        source: Object.values(DomainEventSources),
        detailType: detailTypes,
      },
      targets: DomainEventsRule.getTargets(scope, props),
    });
  }

  private static getTargets = (scope: Construct, props: RulesProps) => {
    const { logGroup } = new LogGroupConstruct(scope, `/aws/events/${DomainEventsRule.name}`);

    return [new SqsQueue(props.queue), new CloudWatchLogGroup(logGroup)];
  };
}
