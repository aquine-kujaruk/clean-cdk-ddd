import { BatchProcessor, EventType } from '@aws-lambda-powertools/batch';
import { ControllerClassType } from '@modules/common/app/src/infraestructure/controllers/base.controller';
import { LambdaHandlerRouter } from '@modules/common/app/src/infraestructure/lambda-handler.router';
import type { Context, SQSBatchResponse, SQSEvent } from 'aws-lambda';
import { AppEventSources } from '../app.event-sources';
import { BookEventsController } from './infraestructure/controllers/book-events.controller';

const processor = new BatchProcessor(EventType.SQS);

type ControllerRoutesType = Partial<Record<AppEventSources, ControllerClassType>>;

const controllerRoutes: ControllerRoutesType = {
  [AppEventSources.BOOK_CONTEXT]: BookEventsController,
};

const triggerUseCase = async ({ body }: { body: string }) => {
  const input = JSON.parse(body);
  const methodName = input['detail-type'];
  const controller = controllerRoutes[input.source as AppEventSources]?.name as string;

  const router = new LambdaHandlerRouter(
    { controller, methodName, input },
    Object.values(controllerRoutes)
  );

  await router.route();
};

export const handler = async (event: SQSEvent, context: Context): Promise<SQSBatchResponse> => {
  console.log('Functions params', JSON.stringify(event, null, 2));

  const batch = event.Records;

  processor.register(batch, triggerUseCase, { context });

  const processedMessages = await processor.process();

  for (const message of processedMessages) {
    const [status, error, record] = message;

    console.log('Processed record', { status, record, error });
  }

  return processor.response();
};
