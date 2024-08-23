import { AuthorizerFunctionConstruct } from '@modules/common/app/lib/constructs/api-gateway/authorizer-function.construct';
import { SimpleAuthorizerLambda } from '@modules/common/app/lib/resources/lambda/functions/simple-authorizer.lambda';
import { IdentitySource } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class SimpleAuthorizer extends AuthorizerFunctionConstruct {
  constructor(scope: Construct) {
    super(scope, SimpleAuthorizer.name, {
      handler: SimpleAuthorizerLambda.getImportedResource(scope),
      identitySources: [IdentitySource.header('authorization')],
    });
  }
}
