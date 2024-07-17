import { LambdaBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/lambda.builder';
import { ChainableSfnDefinition } from '@modules/shared/app/lib/helpers/builders/state-machine.builder';
import { getExecutionStackPath } from '@modules/shared/app/src/application/get-execution-stack-path';
import { LambdaTaskInput } from '@modules/shared/app/src/application/lambda-task-input';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Fail, JsonPath, Succeed } from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { BookDomainLambda } from '../../infraestructure/lib/book-domain.lambda';
import { BookInfraestructureLambda } from '../../infraestructure/lib/book-infraestructure.lambda';
import { BookDomainService } from '../../infraestructure/src/services/book-domain.service';
import { BookInfraestructureService } from '../../infraestructure/src/services/book-infraestructure.service';

enum StepNames {
  GENERATE_TIMESTAMP = 'Generate timestamp with current date',
  GENERATE_IDENTIFIER = 'Generate book id code',
  CREATE_BOOK = 'Create book entity',
  SAVE_BOOK = 'Save Book',
}

export class CreateBookDefinition extends ChainableSfnDefinition {
  private readonly fail: Fail;
  private readonly succeed: Succeed;
  private readonly bookInfraestructureHandler: IFunction;
  private readonly bookDomainHandler: IFunction;

  constructor(scope: Construct) {
    super(scope);

    this.fail = new Fail(scope, 'Fail');
    this.succeed = new Succeed(scope, 'Succeed', {
      outputPath: JsonPath.DISCARD,
    });

    this.bookInfraestructureHandler = LambdaBuilderConstruct.getImportedResource(
      this.scope,
      BookInfraestructureLambda.name
    );

    this.bookDomainHandler = LambdaBuilderConstruct.getImportedResource(
      this.scope,
      BookDomainLambda.name
    );
  }

  public get definitionChain() {
    return this.generateTimestamp
      .next(this.generateIdentifier)
      .next(this.createBook)
      .next(this.saveBook)
      .next(this.succeed);
  }

  private get generateTimestamp() {
    return new LambdaInvoke(this.scope, StepNames.GENERATE_TIMESTAMP, {
      lambdaFunction: this.bookInfraestructureHandler,
      payloadResponseOnly: true,
      payload: LambdaTaskInput.fromObject({
        service: BookInfraestructureService,
        methodName: BookInfraestructureService.getTimestamp.name,
        executionStack: {},
        previousStep: {},
      }),
    }).addCatch(this.fail);
  }

  private get generateIdentifier() {
    return new LambdaInvoke(this.scope, StepNames.GENERATE_IDENTIFIER, {
      lambdaFunction: this.bookInfraestructureHandler,
      payloadResponseOnly: true,
      payload: LambdaTaskInput.fromObject({
        service: BookInfraestructureService,
        methodName: BookInfraestructureService.generateUuid.name,
      }),
    }).addCatch(this.fail);
  }

  private get createBook() {
    return new LambdaInvoke(this.scope, StepNames.CREATE_BOOK, {
      lambdaFunction: this.bookDomainHandler,
      payloadResponseOnly: true,
      payload: LambdaTaskInput.fromObject({
        service: BookDomainService,
        methodName: BookDomainService.create.name,
        input: {
          name: JsonPath.stringAt('$$.Execution.Input.body.name'),
          id: getExecutionStackPath<StepNames>(StepNames.GENERATE_IDENTIFIER, 'output'),
          timestamp: getExecutionStackPath<StepNames>(StepNames.GENERATE_IDENTIFIER, 'output'),
        },
      }),
    }).addCatch(this.fail);
  }

  private get saveBook() {
    return new LambdaInvoke(this.scope, StepNames.SAVE_BOOK, {
      lambdaFunction: this.bookInfraestructureHandler,
      payloadResponseOnly: true,
      payload: LambdaTaskInput.fromObject({
        service: BookInfraestructureService,
        methodName: BookInfraestructureService.saveBook.name,
        input: JsonPath.objectAt('$.previousStep.output'),
      }),
    }).addCatch(this.fail);
  }
}
