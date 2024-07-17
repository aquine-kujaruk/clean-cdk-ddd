import { AwsDynamoDbAdapter } from '@modules/shared/app/src/infraestructure/adapters/aws-dynamo-db.adapter';
import { constantCase } from 'change-case-all';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ArcWebsocketEventMessageType } from '../services/arc-retail-websocket-events.service';

dayjs.extend(utc);
dayjs.extend(timezone);

export class EventDbRepository {
  async save(data: ArcWebsocketEventMessageType, referenceKeys: string[]) {
    const { index, message } = data.detail;

    const references = referenceKeys.map((key) => `${constantCase(key)}#${message[key]}`).join(`#`);

    const referenceIndex = parseInt(index, 10);

    const eventDate = dayjs(referenceIndex).format(process.env.DEFAULT_DATE_FORMAT);

    const input = {
      TableName: process.env.EVENT_STORE_TABLE_NAME,
      Item: {
        PK: `DOMAIN_EVENT#EVENT_TYPE#${constantCase(data['detail-type'])}`,
        SK: `SOURCE#${data.source}#${references}#INDEX#${referenceIndex}`,
        GSI1PK: `DOMAIN_EVENT#SORTED_EVENTS_BY_SOURCE#SOURCE#${data.source}`,
        GSI1SK: `EVENT_DATE#${eventDate}`,
        GSI2PK: `DOMAIN_EVENT#SORTED_EVENTS_BY_TYPE#EVENT_TYPE#${constantCase(
          data['detail-type']
        )}`,
        GSI2SK: `EVENT_DATE#${eventDate}`,
        ttl: dayjs().add(6, 'month').unix(),
        payload: JSON.stringify(message),
      },
      ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
    };

    try {
      await AwsDynamoDbAdapter.upsertItem(input);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException')
        console.warn('Ignoring duplicated event. [Event]: ', JSON.stringify(data, null, 2));
      else throw error;
    }
  }
}
