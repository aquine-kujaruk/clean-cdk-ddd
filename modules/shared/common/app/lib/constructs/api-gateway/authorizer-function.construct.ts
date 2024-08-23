import { Duration } from 'aws-cdk-lib';
import {
  RequestAuthorizer,
  RequestAuthorizerProps
} from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import _ from 'lodash';
import { getConstructName, getUserResourceName } from '../resource-names.util';
import { BaseConstruct } from '../base.construct';

export class AuthorizerFunctionConstruct extends BaseConstruct<RequestAuthorizerProps> {
  public authorizer: RequestAuthorizer;

  constructor(scope: Construct, name: string, props: RequestAuthorizerProps) {
    super(scope, name, props);

    this.build();
  }

  public build() {
    this.authorizer = new RequestAuthorizer(
      this,
      getConstructName(this.name),
      _.merge(
        {
          authorizerName: getUserResourceName(this.name),
          resultsCacheTtl: Duration.seconds(0),
        } as Partial<RequestAuthorizer>,
        this.props
      )
    );
  }
}
