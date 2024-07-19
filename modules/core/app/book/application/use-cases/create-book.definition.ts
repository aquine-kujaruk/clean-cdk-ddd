import { LambdaInvokeTask } from '@modules/shared/app/application/lib/custom-tasks/lambda-invoke.task';
import { LambdaBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/lambda.builder';
import { ChainableSfnDefinition } from '@modules/shared/app/lib/helpers/builders/state-machine.builder';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Fail, JsonPath } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { BookLambda } from '../../infraestructure/lib/book.lambda';
import { BookService } from '../src/services/book.service';

enum StepNames {
  CREATE_BOOK = 'Create Book Object',
  SAVE_BOOK = 'Save Book in Database',
}

export class CreateBookDefinition extends ChainableSfnDefinition {
  private readonly fail: Fail;
  private readonly bookHandler: IFunction;

  constructor(scope: Construct) {
    super(scope);

    this.fail = new Fail(scope, 'Fail');

    this.bookHandler = LambdaBuilderConstruct.getImportedResource(this.scope, BookLambda.name);
  }

  public get definitionChain() {
    return this.createBook.next(this.saveBook);
  }

  private get createBook() {
    return new LambdaInvokeTask(this.scope, StepNames.CREATE_BOOK, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        service: BookService,
        methodName: BookService.createBook.name,
        input: {
          name: JsonPath.stringAt('$.body.name'),
        },
        initializeContext: true,
      },
    }).addCatch(this.fail);
  }

  private get saveBook() {
    return new LambdaInvokeTask(this.scope, StepNames.SAVE_BOOK, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        service: BookService,
        methodName: BookService.saveBook.name,
        input: JsonPath.objectAt(LambdaInvokeTask.previousStepOutput),
      },
      resultSelector: {
        bookId: JsonPath.stringAt(
          LambdaInvokeTask.executionStepOutput(StepNames.CREATE_BOOK, 'id')
        ),
      },
    }).addCatch(this.fail);
  }
}
