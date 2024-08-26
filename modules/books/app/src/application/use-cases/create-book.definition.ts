import { ChainableSfnDefinition } from '@modules/common/app/lib/constructs/step-functions/state-machine.construct';
import { LambdaInvokeTask } from '@modules/common/app/lib/constructs/step-functions/tasks/lambda-invoke.task';
import { ParallelTask } from '@modules/common/app/lib/constructs/step-functions/tasks/parallel.task';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Fail, JsonPath } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { BookLambda } from '../../../lib/book.lambda';
import { BookController } from '../../infraestructure/controllers/book.controller';

const { getOutputPath } = LambdaInvokeTask;

enum Steps {
  FETCH_BOOK_AUTHOR = 'Fetch Book Author',
  FETCH_BOOK_DESCRIPTION = 'Fetch Book Description',
  ENRICH_BOOK = 'Enrich Book',
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
    return this[Steps.ENRICH_BOOK].next(this[Steps.CREATE_BOOK]).next(this[Steps.SAVE_BOOK]);
  }

  private get [Steps.FETCH_BOOK_AUTHOR]() {
    return new LambdaInvokeTask(this.scope, Steps.FETCH_BOOK_AUTHOR, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        controller: BookController,
        methodName: BookController.fetchBookAuthor.name,
      },
    });
  }

  private get [Steps.FETCH_BOOK_DESCRIPTION]() {
    return new LambdaInvokeTask(this.scope, Steps.FETCH_BOOK_DESCRIPTION, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        controller: BookController,
        methodName: BookController.fetchBookDescription.name,
      },
    });
  }

  private get [Steps.ENRICH_BOOK]() {
    return new ParallelTask(this.scope, Steps.ENRICH_BOOK, {})
      .addCatch(this.fail)
      .branch(this[Steps.FETCH_BOOK_AUTHOR])
      .branch(this[Steps.FETCH_BOOK_DESCRIPTION])
      .formatResult();
  }

  private get [Steps.CREATE_BOOK]() {
    return new LambdaInvokeTask(this.scope, Steps.CREATE_BOOK, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        controller: BookController,
        methodName: BookController.createBook.name,
        input: {
          name: JsonPath.stringAt('$$.Execution.Input.body.name'),
          author: JsonPath.stringAt(getOutputPath(Steps.ENRICH_BOOK, 'fetchBookAuthor.author')),
          description: JsonPath.stringAt(
            getOutputPath(Steps.ENRICH_BOOK, 'fetchBookDescription.description')
          ),
        },
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
        input: JsonPath.objectAt(getOutputPath(Steps.CREATE_BOOK)),
      },
      resultSelector: {
        bookId: JsonPath.stringAt(getOutputPath(Steps.CREATE_BOOK, 'id')),
      },
    }).addCatch(this.fail);
  }
}
