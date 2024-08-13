import { EventBusBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/event-bus.builder';
import { Construct } from 'constructs';

export class AppEventsBus extends EventBusBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, AppEventsBus.name, {});
  }
}
