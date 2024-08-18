import { LambdaAuthorizerBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/lambda-authorizer.builder';
import { IdentitySource } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { SimpleAuthorizerLambda } from '../lambda-functions/simple-authorizer.lambda';

export class SimpleAuthorizer extends LambdaAuthorizerBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, SimpleAuthorizer.name, {
      handler: SimpleAuthorizerLambda.getImportedResource(scope),
      identitySources: [IdentitySource.header('authorization')],
    });
  }
}
