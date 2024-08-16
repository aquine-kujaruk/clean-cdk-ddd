import { ControllerClassType } from '../../infraestructure/controllers/base.controller';

export interface DomainEventDetailType {
  index: string;
  message: Record<string, any>;
}

export interface DomainEventBody<SourceType> {
  eventSource: SourceType;
  eventType: string;
  detail: DomainEventDetailType;
}

export type IDomainEvent<SourceType> = new (...args: any) => BaseDomainEvent<
  SourceType,
  Record<string, any>
>;

export class HandlerConsumer {
  constructor(
    public handler: string,
    public controller: ControllerClassType,
    public methodName: string
  ) {}
}

export class UseCaseConsumer {
  constructor(public useCase: string, public body: Record<string, any>) {}
}

export interface BaseDomainEvent<SourceType, MessageType> {
  compositeIdKeys: string[];
  message: MessageType;

  create(index: string): DomainEventBody<SourceType>;
  methodConsumers(): HandlerConsumer[];
  useCaseConsumers(): UseCaseConsumer[];
}
