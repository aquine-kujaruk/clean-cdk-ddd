import { EventBusBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/event-bus.builder';
import { Construct } from 'constructs';

export class AppEventsBus extends EventBusBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, AppEventsBus.name, {});
  }
}