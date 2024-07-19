import { AppEventSources } from '../../infraestructure/app.event-sources';
import { AppEvents } from '../../infraestructure/app.events';

export class AppEventValueObject {
  constructor(
    public readonly eventSource: AppEventSources,
    public readonly eventType: keyof typeof AppEvents,
    public readonly message: Record<string, any>
  ) {}
}
