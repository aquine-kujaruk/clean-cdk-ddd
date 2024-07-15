import { Secret, SecretProps } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import _ from 'lodash';
import { BaseBuilder } from './base.builder';

export class SecretBuilderConstruct extends BaseBuilder<Secret, SecretProps> {
  constructor(scope: Construct, id: string, props: SecretProps) {
    super(scope, id, props);
  }

  public static getResourceName(name: string): string {
    return BaseBuilder.getStatefulResourceName(name);
  }

  public build(): Secret {
    const bucket = new Secret(
      this,
      SecretBuilderConstruct.getConstructName(this.id),
      _.merge(
        {
          secretName: SecretBuilderConstruct.getResourceName(this.id),
        } as Partial<SecretProps>,
        this.props
      )
    );

    return bucket;
  }
}
