import { EcsFargateServiceBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/ecs-fargate-service.builder';
import { BackOfficeCluster } from '@modules/common/app/lib/resources/ecs/clusters/back-office.cluster';
import { CoreVpc } from '@modules/common/app/lib/resources/networking/vpcs/core.vpc';
import { BackOfficeBucket } from '@modules/common/app/lib/resources/storages/buckets/back-office.bucket';
import { aws_ecs, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import dotenv from 'dotenv';
import path from 'path';

const environment: any = dotenv.config({ path: path.join(__dirname, '../src/.env') })?.parsed;

export class BackOfficeEcsFargate extends EcsFargateServiceBuilderConstruct {
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
