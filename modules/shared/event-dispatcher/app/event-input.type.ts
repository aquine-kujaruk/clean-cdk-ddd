import { EventBridgeEvent } from 'aws-lambda';

export type EventInput<T> = EventBridgeEvent<string, any> & {
  'detail-type': keyof T;
  detail: {
    index: string;
    message: Record<string, any>;
  };
};
