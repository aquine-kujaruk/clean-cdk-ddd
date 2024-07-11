import { UserCommands } from '@packages/core/app/user/user.commands';
import { UserQueries } from '@packages/core/app/user/user.queries';
import { AppEvents } from '../event-dispatcher/app.events';

export const AppCommands = {
  ...UserCommands,
};

export const AppQueries = {
  ...UserQueries,
};

export const AppRequests = {
  ...AppCommands,
  ...AppQueries,
  ...AppEvents,
};

export type AppRequestType = keyof typeof AppRequests;
