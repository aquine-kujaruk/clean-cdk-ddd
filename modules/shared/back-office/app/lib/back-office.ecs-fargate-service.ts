import { FargateServiceConstruct } from '@modules/common/app/lib/constructs/ecs/fargate-service.construct';
import { BackOfficeCluster } from '@modules/common/app/lib/resources/ecs/clusters/back-office.cluster';
import { BackOfficeBucket } from '@modules/common/app/lib/resources/s3/buckets/back-office.bucket';
import { CoreVpc } from '@modules/common/app/lib/resources/vpc/vpcs/core.vpc';
import { aws_ecs, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import dotenv from 'dotenv';
import path from 'path';

const environment: any = dotenv.config({ path: path.join(__dirname, '../src/.env') })?.parsed;

export class BackOfficeEcsFargate extends FargateServiceConstruct {
  constructor(scope: Construct) {
    const containerPort = environment.CONTAINER_PORT
      ? parseInt(environment.CONTAINER_PORT, 10)
      : 8055;

    super(scope, BackOfficeEcsFargate.name, {
      cluster: BackOfficeCluster.getImportedResource(scope, CoreVpc.getImportedResource(scope)),
      taskImageOptions: {
        image: aws_ecs.ContainerImage.fromAsset(path.join(__dirname, '../src')),
        containerPort,
        environment: {
          ...environment,
          STORAGE_LOCATIONS: 's3',
          STORAGE_S3_DRIVER: 's3',
          STORAGE_S3_BUCKET: BackOfficeBucket.resourceName,
          STORAGE_S3_REGION: Stack.of(scope).region,
        },
      },
      capacityProviderStrategies: [{ capacityProvider: 'FARGATE_SPOT', weight: 1 }],
    });
  }
}
