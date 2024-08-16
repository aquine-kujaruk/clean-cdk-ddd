import { ChainableSfnDefinition } from '@modules/common/app/lib/construct-utils/builders/state-machine.builder';
import { LambdaInvokeTask } from '@modules/common/app/lib/construct-utils/sfn-custom-tasks/lambda-invoke.task';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Fail, JsonPath } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { BookController } from '../../src/infraestructure/controllers/book.controller';
import { BookLambda } from '../book.lambda';

enum Steps {
  CREATE_BOOK = 'Create Book Object',
  SAVE_BOOK = 'Save Book in Database',
}

export class CreateBookDefinition extends ChainableSfnDefinition {
  private readonly fail: Fail;
  private readonly bookHandler: IFunction;

  constructor(scope: Construct) {
    super(scope);

    this.fail = new Fail(scope, 'Fail');

    this.bookHandler = BookLambda.getImportedResource(this.scope);
  }

  public get definitionChain() {
    return this[Steps.CREATE_BOOK].next(this[Steps.SAVE_BOOK]);
  }

  private get [Steps.CREATE_BOOK]() {
    return new LambdaInvokeTask(this.scope, Steps.CREATE_BOOK, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        controller: BookController,
        methodName: BookController.createBook.name,
        input: {
          name: JsonPath.stringAt('$.body.name'),
        },
        initializeContext: true,
      },
    }).addCatch(this.fail);
  }

  private get [Steps.SAVE_BOOK]() {
    return new LambdaInvokeTask(this.scope, Steps.SAVE_BOOK, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        controller: BookController,
        methodName: BookController.saveBook.name,
        input: JsonPath.objectAt(LambdaInvokeTask.previousStepOutput),
      },
      resultSelector: {
        bookId: JsonPath.stringAt(LambdaInvokeTask.executionStepOutput(Steps.CREATE_BOOK, 'id')),
      },
    }).addCatch(this.fail);
  }
}
