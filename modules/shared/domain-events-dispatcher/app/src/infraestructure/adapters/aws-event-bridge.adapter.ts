import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsRequestEntry,
} from '@aws-sdk/client-eventbridge';

const client = new EventBridgeClient();

export class AwsEventBridgeAdapter {
  public static putEvent(event: PutEventsRequestEntry) {
    const command = new PutEventsCommand({
      Entries: [event],
    });

    return client.send(command);
  }
}
