import { Construct } from 'constructs';
import { AppSecrets } from './secrets/app.secret';

export class Secrets {
  constructor(scope: Construct) {
    new AppSecrets(scope);
  }
}
