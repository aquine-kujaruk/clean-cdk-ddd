import { BookCommands } from '@modules/books/app/book.commands';
import { BookQueries } from '@modules/books/app/book.queries';
import { AppEvents } from '@modules/event-dispatcher/app/app.events';

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

export type AppRequestType = keyof typeof AppRequests;
