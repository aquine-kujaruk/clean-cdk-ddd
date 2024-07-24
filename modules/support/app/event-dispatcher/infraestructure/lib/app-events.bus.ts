import { EventBusBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/event-bus.builder';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export class AppEventsBus extends EventBusBuilderConstruct {
  public bus: EventBus;

  constructor(scope: Construct) {
    super(scope, AppEventsBus.name, {});

    this.bus = super.build();
  }
}