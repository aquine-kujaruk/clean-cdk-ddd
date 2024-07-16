import { LambdaBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/lambda.builder';
import { ChainableSfnDefinition } from '@modules/shared/app/lib/helpers/builders/state-machine.builder';
import { getExecutionStackPath } from '@modules/shared/app/src/application/get-execution-stack-path';
import { LambdaTaskInput } from '@modules/shared/app/src/application/lambda-task-input';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Fail, JsonPath, Succeed } from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { UserDomainController } from '../../../../domain/code/controllers/user-domain.controller';
import { UserDomainLambda } from '../../../../domain/user-domain.lambda';
import { UserInfraestructureController } from '../../../../infraestructure/code/controllers/user-infraestructure.controller';
import { UserInfraestructureLambda } from '../../../../infraestructure/user-infraestructure.lambda';

enum StepNames {
  GENERATE_TIMESTAMP = 'Generate timestamp with current date',
  GENERATE_IDENTIFIER = 'Generate user id code',
  CREATE_USER = 'Create user entity',
  SAVE_USER = 'Save User',
}

export default class extends ChainableSfnDefinition {
  private readonly fail: Fail;
  private readonly succeed: Succeed;
  private readonly userInfraestructureHandler: IFunction;
  private readonly userDomainHandler: IFunction;

  constructor(scope: Construct) {
    super(scope);

    this.fail = new Fail(scope, 'Fail');
    this.succeed = new Succeed(scope, 'Succeed', {
      outputPath: JsonPath.DISCARD,
    });

    this.userInfraestructureHandler = LambdaBuilderConstruct.getImportedResource(
      this.scope,
      UserInfraestructureLambda.name
    );

    this.userDomainHandler = LambdaBuilderConstruct.getImportedResource(
      this.scope,
      UserDomainLambda.name
    );
  }

  public get definitionChain() {
    return this.generateTimestamp
      .next(this.generateIdentifier)
      .next(this.createUser)
      .next(this.saveUser)
      .next(this.succeed);
  }

  private get generateTimestamp() {
    return new LambdaInvoke(this.scope, StepNames.GENERATE_TIMESTAMP, {
      lambdaFunction: this.userInfraestructureHandler,
      payloadResponseOnly: true,
      payload: LambdaTaskInput.fromObject({
        controller: UserInfraestructureController,
        methodName: UserInfraestructureController.getTimestamp.name,
        executionStack: {},
        previousStep: {},
      }),
    }).addCatch(this.fail);
  }

  private get generateIdentifier() {
    return new LambdaInvoke(this.scope, StepNames.GENERATE_IDENTIFIER, {
      lambdaFunction: this.userInfraestructureHandler,
      payloadResponseOnly: true,
      payload: LambdaTaskInput.fromObject({
        controller: UserInfraestructureController,
        methodName: UserInfraestructureController.generateUuid.name,
      }),
    }).addCatch(this.fail);
  }

  private get createUser() {
    return new LambdaInvoke(this.scope, StepNames.CREATE_USER, {
      lambdaFunction: this.userDomainHandler,
      payloadResponseOnly: true,
      payload: LambdaTaskInput.fromObject({
        controller: UserDomainController,
        methodName: UserDomainController.create.name,
        input: {
          name: JsonPath.stringAt('$$.Execution.Input.body.name'),
          id: getExecutionStackPath<StepNames>(StepNames.GENERATE_IDENTIFIER, 'output'),
          timestamp: getExecutionStackPath<StepNames>(StepNames.GENERATE_IDENTIFIER, 'output'),
        },
      }),
    }).addCatch(this.fail);
  }

  private get saveUser() {
    return new LambdaInvoke(this.scope, StepNames.SAVE_USER, {
      lambdaFunction: this.userInfraestructureHandler,
      payloadResponseOnly: true,
      payload: LambdaTaskInput.fromObject({
        controller: UserInfraestructureController,
        methodName: UserInfraestructureController.saveUser.name,
        input: JsonPath.objectAt('$.previousStep.output'),
      }),
    }).addCatch(this.fail);
  }
}
