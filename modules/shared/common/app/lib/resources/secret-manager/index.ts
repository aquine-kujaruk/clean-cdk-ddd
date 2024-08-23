import { Construct } from 'constructs';
import { AppSecrets } from './secrets/app.secret';

export class SecretManager {
  constructor(scope: Construct) {
    new AppSecrets(scope);
  }
}
