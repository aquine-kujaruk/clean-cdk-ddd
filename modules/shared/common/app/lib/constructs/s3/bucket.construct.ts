import { RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BucketProps } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import _ from 'lodash';
import { getCommonResourceName, getConstructName } from '../resource-names.util';
import { BaseConstruct } from '../base.construct';

export class BucketConstruct extends BaseConstruct<BucketProps> {
  public bucket: Bucket;

  constructor(scope: Construct, name: string, props: BucketProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName() {
    return getCommonResourceName(this.name.toLowerCase());
  }

  public build() {
    this.bucket = new Bucket(
      this,
      getConstructName(this.name),
      _.merge(
        {
          bucketName: getCommonResourceName(this.name.toLowerCase()),
          removalPolicy: RemovalPolicy.DESTROY,
          autoDeleteObjects: true,
        } as Partial<BucketProps>,
        this.props
      )
    );
  }
}
