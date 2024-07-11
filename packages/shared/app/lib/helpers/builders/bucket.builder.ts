import { RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BucketProps } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import _ from 'lodash';
import { BaseBuilder } from './base.builder';

export class BucketBuilderConstruct extends BaseBuilder<Bucket, BucketProps> {
  constructor(scope: Construct, id: string, props: BucketProps) {
    super(scope, id, props);
  }

  public static getResourceName(name: string): string {
    return this.getStatefulResourceName(name.toLowerCase());
  }

  public build(): Bucket {
    const bucket = new Bucket(
      this,
      BucketBuilderConstruct.getConstructName(this.id),
      _.merge(
        {
          bucketName: BucketBuilderConstruct.getResourceName(this.id),
          removalPolicy: RemovalPolicy.DESTROY,
          autoDeleteObjects: true,
        } as Partial<BucketProps>,
        this.props
      )
    );

    return bucket;
  }
}
