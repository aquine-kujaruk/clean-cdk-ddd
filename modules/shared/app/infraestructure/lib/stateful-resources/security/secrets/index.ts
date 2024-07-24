import { Construct } from 'constructs';
import { AppSecrets } from './app.secret';

export class Secrets {
  constructor(scope: Construct) {
    new AppSecrets(scope);
  }
}
