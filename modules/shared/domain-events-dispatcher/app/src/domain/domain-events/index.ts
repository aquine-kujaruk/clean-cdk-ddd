import { IDomainEvent } from '@modules/common/app/src/domain/events/base.domain-event';
import { CommentCretedEvent } from './book/comment-created.event';
import { DomainEventSources } from '../../../domain-event.sources';



export const DomainEvents: IDomainEvent<DomainEventSources>[] = [
  // BookEvents,
  CommentCretedEvent,
];
