import { Architecture, Function, FunctionProps, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import _ from 'lodash';
import { LambdaRole } from '../../stateful-resources/iam/roles/lambda.role';
import { BaseBuilder } from './base.builder';
import { LogGroupBuilderConstruct } from './log-group.builder';
import { RoleBuilderConstruct } from './role.builder';

export class LambdaBuilderConstruct extends BaseBuilder<Function, FunctionProps> {
  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id, props);
  }

  public static getResourceName(name: string): string {
    return LambdaBuilderConstruct.getStatelessResourceName(name);
  }

  public static getArn(scope: Construct, name: string): string {
    const { region, account } = this.getStack(scope);
    return `arn:aws:lambda:${region}:${account}:function:${LambdaBuilderConstruct.getResourceName(
      name
    )}`;
  }

  public static getImportedResource(scope: Construct, name: string): IFunction {
    const stack = this.getStack(scope);
    stack.getLogicalId;
    return Function.fromFunctionName(
      scope,
      LambdaBuilderConstruct.getUniqueConstructName(name),
      LambdaBuilderConstruct.getResourceName(name)
    );
  }

  public build(): Function | undefined {
    if (!this.isActive('function')) return;

    const functionName = LambdaBuilderConstruct.getResourceName(this.id);

    const handler = new Function(
      this,
      LambdaBuilderConstruct.getConstructName(this.id),
      _.merge(
        {
          functionName,
          handler: 'index.handler',
          runtime: Runtime.NODEJS_20_X,
          architecture: Architecture.X86_64,
          role: RoleBuilderConstruct.getImportedResource(this, LambdaRole.name),
          logGroup: LogGroupBuilderConstruct.createResource(this, `/aws/lambda/${functionName}`),
        } as Partial<FunctionProps>,
        this.props
      )
    );

    return handler;
  }
}
