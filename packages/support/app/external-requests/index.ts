import { Construct } from 'constructs';
import { PublicApi } from './lib/public-api';

export class ExternalRequests {
  constructor(scope: Construct) {
    new PublicApi(scope);
  }
}
