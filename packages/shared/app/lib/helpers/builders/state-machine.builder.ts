import { StateMachineRole } from '../../stateful-resources/iam/roles/state-machine.role';
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
import { BaseBuilder } from './base.builder';
import { RoleBuilderConstruct } from './role.builder';
import { LogGroupBuilderConstruct } from './log-group.builder';

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
    return StateMachineBuilderConstruct.getStatelessResourceName(name);
  }

  public static getArn(scope: Construct, name: string): string {
    const { region, account } = this.getStack(scope);
    return `arn:aws:sqs:${region}:${account}:${StateMachineBuilderConstruct.getResourceName(name)}`;
  }

  public static getImportedResource(scope: Construct, name: string): IStateMachine {
    return StateMachine.fromStateMachineName(
      scope,
      StateMachineBuilderConstruct.getConstructName(name),
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

  public build(): StateMachine | undefined {
    if (!this.isActive('stateMachine')) return;

    const stateMachineProps = this.props;

    this.validateBody(stateMachineProps);

    const stateMachineName = StateMachineBuilderConstruct.getResourceName(this.id);

    // Tiene que ser así para que tenga el scope correcto
    const { definitionChain } = new this.props.definitionJob(this);

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
