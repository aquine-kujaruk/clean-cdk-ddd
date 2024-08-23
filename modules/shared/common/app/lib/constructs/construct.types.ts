import { Construct } from 'constructs';
import { TableConstruct } from './dynamo-db/table.construct';
import { EventBusConstruct } from './event-bridge/event-bus.construct';
import { FunctionConstruct } from './lambda/function.construct';
import { NodejsFunctionConstruct } from './lambda/nodejs-function.construct';
import { RestApiConstruct } from './api-gateway/rest-api.construct';
import { StateMachineConstruct } from './step-functions/state-machine.construct';
import { AuthorizerFunctionConstruct } from './api-gateway/authorizer-function.construct';

type ConstructType<T extends Construct> = new (...args: any[]) => T;

export type RestApiConstructType = ConstructType<RestApiConstruct>;

export type AuthorizerFunctionConstructType = ConstructType<AuthorizerFunctionConstruct>;

export type LambdaConstructType = ConstructType<
  FunctionConstruct | NodejsFunctionConstruct
>;

export type StateMachineConstructType = ConstructType<StateMachineConstruct>;

export type TableConstructType = ConstructType<TableConstruct>;

export type EventBusConstructType = ConstructType<EventBusConstruct>;

export type RestApiIntegrationTargetTypes =
  | LambdaConstructType
  | StateMachineConstructType
  | EventBusConstructType
  | TableConstructType;
