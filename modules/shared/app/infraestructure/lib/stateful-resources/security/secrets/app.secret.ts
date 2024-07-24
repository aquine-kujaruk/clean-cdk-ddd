import { SecretBuilderConstruct } from '../../../../lib/construct-utils/builders/secrets.builder';
import { Construct } from 'constructs';

export class AppSecrets extends SecretBuilderConstruct {
  constructor(scope: Construct) {
    super(scope, AppSecrets.name, {});
  }
}