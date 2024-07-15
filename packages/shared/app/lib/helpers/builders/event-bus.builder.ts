import { EventBus, EventBusProps, IEventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import _ from 'lodash';
import { BaseBuilder } from './base.builder';

export class EventBusBuilderConstruct extends BaseBuilder<EventBus, EventBusProps> {
  constructor(scope: Construct, id: string, props: EventBusProps) {
    super(scope, id, props);
  }

  public static getResourceName(name: string): string {
    return BaseBuilder.getStatelessResourceName(name);
  }

  public static getImportedResource(scope: Construct, name: string): IEventBus {
    const stack = BaseBuilder.getStack(scope);
    stack.getLogicalId;
    return EventBus.fromEventBusName(
      scope,
      BaseBuilder.getUniqueConstructName(name),
      EventBusBuilderConstruct.getResourceName(name)
    );
  }

  public build(): EventBus {
    const bus = new EventBus(
      this,
      EventBusBuilderConstruct.getConstructName(this.id),
      _.merge(
        {
          eventBusName: EventBusBuilderConstruct.getResourceName(this.id),
        } as Partial<EventBusProps>,
        this.props
      )
    );

    return bus;
  }
}
