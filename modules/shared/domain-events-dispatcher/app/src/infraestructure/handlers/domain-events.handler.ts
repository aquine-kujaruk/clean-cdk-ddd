import { BatchProcessor, EventType } from '@aws-lambda-powertools/batch';
import { Router } from '@modules/common/app/src/infraestructure/handlers/router';
import type { Context, SQSBatchResponse, SQSEvent, SQSRecord } from 'aws-lambda';
import { DispatchEventsController } from '../controllers/dispatch-events.controller';

const controllers = [DispatchEventsController];

const processor = new BatchProcessor(EventType.SQS);

const handle = async (record: SQSRecord) => {
  const router = new Router(
    {
      controller: DispatchEventsController.name,
      methodName: DispatchEventsController.dispatch.name,
      input: record,
    },
    controllers
  );
  return router.route();
};

export const handler = async (event: SQSEvent, context: Context): Promise<SQSBatchResponse> => {
  console.log('Functions params', JSON.stringify(event, null, 2));

  const batch = event.Records;

  processor.register(batch, handle, { context });

  const processedMessages = await processor.process();

  for (const message of processedMessages) {
    const [status, error, record] = message;

    console.log('Processed record', { status, record, error });
  }

  return processor.response();
};
