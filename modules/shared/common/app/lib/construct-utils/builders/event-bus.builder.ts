import { EventBus, EventBusProps, IEventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import _ from 'lodash';
import { getCommonResourceName, getConstructName, getUniqueConstructName } from '../resource-names';
import { BaseBuilder } from './base.builder';

export class EventBusBuilderConstruct extends BaseBuilder<EventBusProps> {
  public bus: EventBus;

  constructor(scope: Construct, name: string, props: EventBusProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getCommonResourceName(this.name);
  }

  public static getImportedResource(scope: Construct): IEventBus {
    return EventBus.fromEventBusName(scope, getUniqueConstructName(this.name), this.resourceName);
  }

  public build() {
    this.bus = new EventBus(
      this,
      getConstructName(this.name),
      _.merge(
        {
          eventBusName: getCommonResourceName(this.name),
        } as Partial<EventBusProps>,
        this.props
      )
    );
  }
}
