import { Construct } from 'constructs';
import { DynamoDbBuilderConstruct } from './builders/dynamo-db.builder';
import { EventBusBuilderConstruct } from './builders/event-bus.builder';
import { LambdaBuilderConstruct } from './builders/lambda.builder';
import { NodejsFunctionBuilderConstruct } from './builders/nodejs-function.builder';
import { StateMachineBuilderConstruct } from './builders/state-machine.builder';

type ConstructType<T extends Construct> = new (...args: any[]) => T;

export type LambdaConstructType = ConstructType<
  LambdaBuilderConstruct | NodejsFunctionBuilderConstruct
>;

export type StateMachineConstructType = ConstructType<StateMachineBuilderConstruct>;

export type DynamoDbConstructType = ConstructType<DynamoDbBuilderConstruct>;

export type EventBusConstructType = ConstructType<EventBusBuilderConstruct>;

export type RestApiIntegrationTargetTypes = LambdaConstructType | StateMachineConstructType | EventBusConstructType | DynamoDbConstructType;

