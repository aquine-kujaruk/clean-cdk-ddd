import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import {
  Chain,
  DefinitionBody,
  IStateMachine,
  LogLevel,
  StateMachine,
  StateMachineProps,
  StateMachineType,
} from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import _ from 'lodash';
import {
  getConstructName,
  getUniqueConstructName,
  getUserResourceName,
} from '../resource-names.util';
import { LambdaInvokeTask } from './tasks/lambda-invoke.task';
import { StateMachineRole } from '../../resources/iam/roles/state-machine.role';
import { BaseConstruct } from '../base.construct';
import { LogGroupConstruct } from '../cloud-watch/log-group.construct';

export abstract class ChainableSfnDefinition {
  constructor(protected readonly scope: Construct) {}

  public abstract get definitionChain(): Chain;
}

interface StateMachineConstructProps extends StateMachineProps {
  definitionJob: new (...args: any[]) => ChainableSfnDefinition;
}

export class StateMachineConstruct extends BaseConstruct<StateMachineConstructProps> {
  public handler?: StateMachine;

  constructor(scope: Construct, name: string, props: StateMachineConstructProps) {
    super(scope, name, props);

    // if (super.isActive('stateMachine')) {
      this.build();
    // }
  }

  public static get resourceName(): string {
    return getUserResourceName(this.name);
  }

  public static getArn(scope: Construct): string {
    const { region, account } = Stack.of(scope);
    return `arn:aws:states:${region}:${account}:stateMachine:${this.resourceName}`;
  }

  public static getImportedResource(scope: Construct): IStateMachine {
    return StateMachine.fromStateMachineName(
      scope,
      getUniqueConstructName(this.name),
      this.resourceName
    );
  }

  private validateBody(stateMachineProps: StateMachineProps) {
    if (!stateMachineProps.definitionSubstitutions) return;

    for (const key in stateMachineProps.definitionSubstitutions) {
      if (!stateMachineProps.definitionSubstitutions[key])
        throw {
          stateMachine: this.name,
          key,
          error: new Error('Definition substitution values must be defined'),
        };
    }
  }

  private validateStartState(startState: any) {
    const { initializeContext } = startState?.props?.payload?.value || {};

    if (!(startState instanceof LambdaInvokeTask && initializeContext))
      throw {
        stateMachine: this.name,
        error: new Error(
          `Start state must be an instance of "LambdaInvokeTask" with "initializeContext" payload attribute set to true`
        ),
      };
  }

  public build() {
    const stateMachineProps = this.props;

    this.validateBody(stateMachineProps);

    const stateMachineName = getUserResourceName(this.name);

    // Tiene que ser así para que tenga el scope correcto
    const { definitionChain } = new this.props.definitionJob(this);

    this.validateStartState(definitionChain.startState);

    const { logGroup } = new LogGroupConstruct(this, `/aws/vendedlogs/states/${stateMachineName}`);

    this.handler = new StateMachine(
      this,
      getConstructName(this.name),
      _.merge(
        {
          stateMachineName,
          definitionBody: DefinitionBody.fromChainable(definitionChain),
          stateMachineType: StateMachineType.EXPRESS,
          logs: {
            destination: logGroup,
            level: LogLevel.ALL,
            includeExecutionData: true,
          },
          tracingEnabled: true,
          removalPolicy: RemovalPolicy.DESTROY,
          role: StateMachineRole.getImportedResource(this),
        } as Partial<StateMachineProps>,
        stateMachineProps
      )
    );
  }
}
