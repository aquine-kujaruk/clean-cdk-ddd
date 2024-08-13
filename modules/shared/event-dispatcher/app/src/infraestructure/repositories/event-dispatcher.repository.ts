import { PutEventsRequestEntry } from '@aws-sdk/client-eventbridge';
import { DateRepository } from '@modules/common/app/src/infraestructure/repositories/date.repository';
import { IEventDispatcherRepository } from '../../domain/contracts/event-dispatcher.contract';
import { AppEventValueObject } from '../../domain/value-objects/app-event.value-object';
import { AwsEventBridgeAdapter } from '../adapters/aws-event-bridge.adapter';

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
