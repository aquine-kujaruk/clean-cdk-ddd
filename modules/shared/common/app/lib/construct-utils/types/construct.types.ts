import { Construct } from 'constructs';
import { DynamoDbBuilderConstruct } from '../builders/dynamo-db.builder';
import { EventBusBuilderConstruct } from '../builders/event-bus.builder';
import { LambdaBuilderConstruct } from '../builders/lambda.builder';
import { NodejsFunctionBuilderConstruct } from '../builders/nodejs-function.builder';
import { RestApiBuilderConstruct } from '../builders/rest-api.builder';
import { StateMachineBuilderConstruct } from '../builders/state-machine.builder';
import { LambdaAuthorizerBuilderConstruct } from '../builders/lambda-authorizer.builder';

type ConstructType<T extends Construct> = new (...args: any[]) => T;

export type RestApiConstructType = ConstructType<RestApiBuilderConstruct>;

export type AuthorizerType = ConstructType<LambdaAuthorizerBuilderConstruct>;

export type LambdaConstructType = ConstructType<
  LambdaBuilderConstruct | NodejsFunctionBuilderConstruct
>;

export type StateMachineConstructType = ConstructType<StateMachineBuilderConstruct>;

export type DynamoDbConstructType = ConstructType<DynamoDbBuilderConstruct>;

export type EventBusConstructType = ConstructType<EventBusBuilderConstruct>;

export type RestApiIntegrationTargetTypes =
  | LambdaConstructType
  | StateMachineConstructType
  | EventBusConstructType
  | DynamoDbConstructType;
