import { PutEventsRequestEntry } from '@aws-sdk/client-eventbridge';
import { DayJsRepository } from '@modules/shared/app/src/infraestructure/repositories/day-js.repository';
import { EventBusRepository } from '../../../domain/contracts/event-bus.repository';
import { AppEventValueObject } from '../../../domain/value-objects/app-event.value-object';
import { AwsEventBridgeAdapter } from '../adapters/aws-event-bridge.adapter';

export class AwsEventBridgeRepository implements EventBusRepository {
  private async sendEvent(
    EventBusName: string,
    { eventSource, eventType, message }: AppEventValueObject
  ) {
    const dayJsRepository = new DayJsRepository();
    const index = dayJsRepository.getUnixMilliseconds();

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
