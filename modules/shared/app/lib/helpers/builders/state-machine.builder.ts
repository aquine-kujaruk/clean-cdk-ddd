import { RemovalPolicy } from 'aws-cdk-lib';
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
import { LambdaInvokeTask } from '../../../application/lib/custom-tasks/lambda-invoke.task';
import { StateMachineRole } from '../../stateful-resources/iam/roles/state-machine.role';
import { BaseBuilder } from './base.builder';
import { LogGroupBuilderConstruct } from './log-group.builder';
import { RoleBuilderConstruct } from './role.builder';
import { inspect } from 'util';

export abstract class ChainableSfnDefinition {
  constructor(protected readonly scope: Construct) {}

  public abstract get definitionChain(): Chain;
}

interface StateMachineBuilderConstructProps extends StateMachineProps {
  definitionJob: new (...args: any[]) => ChainableSfnDefinition;
}

export class StateMachineBuilderConstruct extends BaseBuilder<
  StateMachine,
  StateMachineBuilderConstructProps
> {
  constructor(scope: Construct, id: string, props: StateMachineBuilderConstructProps) {
    super(scope, id, props);
  }

  public static getResourceName(name: string): string {
    return BaseBuilder.getStatelessResourceName(name);
  }

  public static getArn(scope: Construct, name: string): string {
    const { region, account } = BaseBuilder.getStack(scope);
    return `arn:aws:states:${region}:${account}:stateMachine:${StateMachineBuilderConstruct.getResourceName(
      name
    )}`;
  }

  public static getImportedResource(scope: Construct, name: string): IStateMachine {
    return StateMachine.fromStateMachineName(
      scope,
      BaseBuilder.getUniqueConstructName(name),
      StateMachineBuilderConstruct.getResourceName(name)
    );
  }

  private validateBody(stateMachineProps: StateMachineProps) {
    if (!stateMachineProps.definitionSubstitutions) return;

    for (const key in stateMachineProps.definitionSubstitutions) {
      if (!stateMachineProps.definitionSubstitutions[key])
        throw {
          stateMachine: this.id,
          key,
          error: new Error('Definition substitution values must be defined'),
        };
    }
  }

  private validateStartState(startState: any) {
    const { initializeContext } = startState?.props?.payload?.value || {};

    if (!(startState instanceof LambdaInvokeTask && initializeContext))
      throw {
        stateMachine: this.id,
        error: new Error(
          `Start state must be an instance of "LambdaInvokeTask" with "initializeContext" payload attribute set to true`
        ),
      };
  }

  public build(): StateMachine | undefined {
    // if (!super.isActive('stateMachine')) return;

    const stateMachineProps = this.props;

    this.validateBody(stateMachineProps);

    const stateMachineName = StateMachineBuilderConstruct.getResourceName(this.id);

    // Tiene que ser así para que tenga el scope correcto
    const { definitionChain } = new this.props.definitionJob(this);

    this.validateStartState(definitionChain.startState);

    const handler = new StateMachine(
      this,
      StateMachineBuilderConstruct.getConstructName(this.id),
      _.merge(
        {
          stateMachineName,
          definitionBody: DefinitionBody.fromChainable(definitionChain),
          stateMachineType: StateMachineType.EXPRESS,
          logs: {
            destination: LogGroupBuilderConstruct.createResource(
              this,
              `/aws/vendedlogs/states/${stateMachineName}`
            ),
            level: LogLevel.ALL,
            includeExecutionData: true,
          },
          tracingEnabled: true,
          removalPolicy: RemovalPolicy.DESTROY,
          role: RoleBuilderConstruct.getImportedResource(this, StateMachineRole.name),
        } as Partial<StateMachineProps>,
        stateMachineProps
      )
    );

    return handler;
  }
}
