import { Construct } from 'constructs';
import { PublicApi } from './lib/public-api';
import { ApiAuthorizersInfraestructureLambda } from './src/infraestructure/api-authorizers-infraestructure.lambda';

export class ExternalRequests {
  constructor(scope: Construct) {
    const authorizer = new ApiAuthorizersInfraestructureLambda(scope);
    const publicApi = new PublicApi(scope);

    publicApi.node.addDependency(authorizer);
  }
}
