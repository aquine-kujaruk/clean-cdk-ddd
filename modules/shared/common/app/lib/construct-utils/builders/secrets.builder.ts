import { Secret, SecretProps } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import _ from 'lodash';
import {
  getConstructName,
  getCommonResourceName
} from '../resource-names';
import { BaseBuilder } from './base.builder';

export class SecretBuilderConstruct extends BaseBuilder<SecretProps> {
  public secret: Secret;

  constructor(scope: Construct, name: string, props: SecretProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getCommonResourceName(this.name);
  }

  public build() {
    this.secret = new Secret(
      this,
      getConstructName(this.name),
      _.merge(
        {
          secretName: getCommonResourceName(this.name),
        } as Partial<SecretProps>,
        this.props
      )
    );
  }
}
