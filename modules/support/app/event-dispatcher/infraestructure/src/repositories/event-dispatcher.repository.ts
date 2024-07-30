import { PutEventsRequestEntry } from '@aws-sdk/client-eventbridge';
import { IEventDispatcherRepository } from '../../../application/src/contracts/event-dispatcher.contract';
import { AwsEventBridgeAdapter } from '../adapters/aws-event-bridge.adapter';
import { DateRepository } from '@modules/shared/app/infraestructure/src/repositories/date.repository';
import { AppEventValueObject } from '../../../domain/src/value-objects/app-event.value-object';

export class EventDispatcherRepository implements IEventDispatcherRepository {
  private async sendEvent(
    EventBusName: string,
    { eventSource, eventType, message }: AppEventValueObject
  ) {
    const dateRepository = new DateRepository();
    const index = dateRepository.getUnixMilliseconds();

    const entry: PutEventsRequestEntry = {
      EventBusName,
      DetailType: eventType,
      Source: eventSource,
      Detail: JSON.stringify({ index, message }),
    };

    await AwsEventBridgeAdapter.putEvent(entry);
  }

  public async sendAppEvent(event: AppEventValueObject) {
    const { APP_EVENT_BUS_NAME } = process.env;

    if (!APP_EVENT_BUS_NAME?.length) throw new Error('process.env.APP_EVENT_BUS_NAME is required');

    const EventBusName = APP_EVENT_BUS_NAME as string;

    await this.sendEvent(EventBusName, event);
  }
}
