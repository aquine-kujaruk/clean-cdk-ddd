import { BaseBuilder } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/base.builder';
import { aws_ecs, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import dotenv from 'dotenv';
import { BucketBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/bucket.builder';

const environment: any = dotenv.config({ path: `${__dirname}/.env` })?.parsed;

export class BackOffice extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = this.vpc;
    const bucket = this.bucket;
    this.service(vpc, bucket);
  }

  private get vpc() {
    return new Vpc(this, BaseBuilder.getConstructName('Main'), {
      vpcName: BaseBuilder.getStatefulResourceName('Main'),
      maxAzs: 2,
      natGateways: 1,
    });
  }

  private get bucket() {
    return new Bucket(this, BucketBuilderConstruct.getConstructName(`${BackOffice.name}Bucket`), {
      bucketName: BucketBuilderConstruct.getResourceName(BackOffice.name),
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }

  private service(vpc: Vpc, bucket: Bucket) {
    const containerPort = environment.CONTAINER_PORT
      ? parseInt(environment.CONTAINER_PORT, 10)
      : 8055;

    const cluster = new aws_ecs.Cluster(
      this,
      BaseBuilder.getConstructName(`${BackOffice.name}Cluster`),
      {
        vpc,
        clusterName: BaseBuilder.getStatefulResourceName(`${BackOffice.name}Cluster`),
      }
    );

    const fargateService = new ApplicationLoadBalancedFargateService(
      this,
      BaseBuilder.getConstructName(`${BackOffice.name}FargateService`),
      {
        cluster: cluster,
        runtimePlatform: {
          operatingSystemFamily: aws_ecs.OperatingSystemFamily.LINUX,
          cpuArchitecture: aws_ecs.CpuArchitecture.X86_64,
        },

        taskImageOptions: {
          image: aws_ecs.ContainerImage.fromAsset(`${__dirname}/src/`),
          containerPort,
          environment: {
            ...environment,
            STORAGE_LOCATIONS: 's3',
            STORAGE_S3_DRIVER: 's3',
            STORAGE_S3_BUCKET: bucket.bucketName,
            STORAGE_S3_REGION: this.region,
          },
        },
        cpu: 256,
        memoryLimitMiB: 512,
        desiredCount: 1,
        publicLoadBalancer: true,
      }
    );

    bucket.grantReadWrite(fargateService.taskDefinition.taskRole);

    fargateService.targetGroup.configureHealthCheck({
      path: '/server/health',
      port: containerPort?.toString(),
    });

    return fargateService;
  }
}
