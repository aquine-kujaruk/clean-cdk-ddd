import { RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BucketProps } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import _ from 'lodash';
import { getConstructName, getCommonResourceName } from '../services/resource-names.service';
import { BaseBuilder } from './base.builder';

export class BucketBuilderConstruct extends BaseBuilder<BucketProps> {
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
