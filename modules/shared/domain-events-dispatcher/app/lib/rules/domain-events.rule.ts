import { LogGroupBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/log-group.builder';
import { RuleBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/rule.builder';
import { DomainEventsBus } from '@modules/common/app/lib/resources/event-bridge/busses/domain-events.bus';
import { IDomainEvent } from '@modules/common/app/src/domain/events/base.domain-event';
import { CloudWatchLogGroup, SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { RulesProps } from '.';
import { DomainEventSources } from '../../domain-event.sources';
import { DomainEvents } from '../../src/domain/domain-events';

export class DomainEventsRule extends RuleBuilderConstruct {
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
    const { logGroup } = new LogGroupBuilderConstruct(
      scope,
      `/aws/events/${DomainEventsRule.name}`
    );

    return [new SqsQueue(props.queue), new CloudWatchLogGroup(logGroup)];
  };
}
