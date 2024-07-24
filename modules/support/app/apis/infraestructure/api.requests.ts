
import { BookQueries } from '@modules/core/app/book/infraestructure/book.queries';
import { BookCommands } from 'core/app/book/infraestructure/book.commands';
import { AppEvents } from '../../event-dispatcher/infraestructure/app.events';

export const AppCommands = {
  ...BookCommands,
};

export const AppQueries = {
  ...BookQueries,
};

export const AppRequests = {
  ...AppCommands,
  ...AppQueries,
  ...AppEvents,
};

export type  AppRequestType = keyof typeof AppRequests;
