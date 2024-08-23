import { SecretConstruct } from '../../../constructs/secret-manager/secrets.construct';
import { Construct } from 'constructs';

export class AppSecrets extends SecretConstruct {
  constructor(scope: Construct) {
    super(scope, AppSecrets.name, {});
  }
}
