import { BaseBuilder } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/base.builder';
import { BucketBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/bucket.builder';
import {
  aws_ecs,
  aws_rds,
  aws_secretsmanager,
  RemovalPolicy,
  SecretValue,
  Stack
} from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Credentials, DatabaseInstance, DatabaseInstanceEngine } from 'aws-cdk-lib/aws-rds';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { snakeCase } from 'change-case-all';
import { Construct } from 'constructs';
import dotenv from 'dotenv';

const { KEY, SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, CONTAINER_PORT }: any = dotenv.config({
  path: `${__dirname}/src/.env`,
})?.parsed;

export class BackOffice extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = this.vpc;
    const bucket = this.bucket;
    const database = this.database(vpc);
    this.service(vpc, bucket, database);
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

  // private database(vpc: Vpc) {
  //   const secret = new aws_rds.DatabaseSecret(this, 'database.secret', {
  //     secretName: BaseBuilder.getStatefulResourceName(snakeCase(`${BackOffice.name}DbSecret`)),
  //     username: 'clusteradmin',
  //   });

  //   // const clustermySQL = new aws_rds.ServerlessCluster(this, 'AuroraCluster', {
  //   //   engine: aws_rds.DatabaseClusterEngine.AURORA_MYSQL,
  //   //   credentials: aws_rds.Credentials.fromGeneratedSecret(
  //   //     snakeCase(`${BackOffice.name}DbPostgres`)
  //   //   ),
  //   //   clusterIdentifier: 'my-aurora-cluster',
  //   //   defaultDatabaseName: 'my_database',
  //   //   enableDataApi: true,
  //   //   scaling: {
  //   //     autoPause: Duration.minutes(10),
  //   //     minCapacity: 1,
  //   //     maxCapacity: 1,
  //   //     timeout: Duration.seconds(100),
  //   //   },
  //   // });

  //   const cluster = new aws_rds.ServerlessCluster(
  //     this,
  //     BaseBuilder.getConstructName(`${BackOffice.name}Db`),
  //     {
  //       // engine: aws_rds.DatabaseClusterEngine.auroraPostgres({
  //       //   version: aws_rds.AuroraPostgresEngineVersion.VER_13_9,
  //       // }),
  //       engine: aws_rds.DatabaseClusterEngine.AURORA_MYSQL,
  //       credentials: aws_rds.Credentials.fromGeneratedSecret(snakeCase(`${BackOffice.name}Db`)),
  //       defaultDatabaseName: 'backoffice',
  //       removalPolicy: RemovalPolicy.DESTROY,
  //       vpc,
  //       scaling: {
  //         autoPause: Duration.minutes(10),
  //         minCapacity: aws_rds.AuroraCapacityUnit.ACU_1,
  //         maxCapacity: aws_rds.AuroraCapacityUnit.ACU_1,
  //         timeout: Duration.seconds(100),
  //       },
  //     }
  //   );

  //   return { cluster, secret };
  // }

  private database(vpc: Vpc) {
    // private securityGroups(vpc: IVpc) {
    //   const dbSecurityGroup = new SecurityGroup(
    //     this,
    //     BaseBuilder.getConstructName(`${BackOffice.name}DbSecurityGroup`),
    //     {
    //       securityGroupName: BaseBuilder.getStatefulResourceName(`${BackOffice.name}DbSecurityGroup`),
    //       vpc,
    //       allowAllOutbound: true,
    //     }
    //   );

    //   const fargateSecurityGroup = new SecurityGroup(
    //     this,
    //     BaseBuilder.getConstructName(`${BackOffice.name}FargateSecurityGroup`),
    //     {
    //       securityGroupName: BaseBuilder.getStatefulResourceName(
    //         `${BackOffice.name}FargateSecurityGroup`
    //       ),
    //       vpc,
    //       allowAllOutbound: true,
    //     }
    //   );

    //   dbSecurityGroup.addIngressRule(
    //     fargateSecurityGroup,
    //     Port.tcp(5432),
    //     'Allow Fargate tasks to connect to RDS'
    //   );

    //   return { dbSecurityGroup, fargateSecurityGroup };
    // }

    const secret = new aws_rds.DatabaseSecret(this, 'database.secret', {
      secretName: BaseBuilder.getStatefulResourceName(snakeCase(`${BackOffice.name}DbSecret`)),
      username: 'clusteradmin',
    });

    const instance = new DatabaseInstance(
      this,
      BaseBuilder.getConstructName(`${BackOffice.name}DbPostgres`),
      {
        engine: DatabaseInstanceEngine.POSTGRES,
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
        vpc,
        databaseName: 'postgres',
        credentials: Credentials.fromGeneratedSecret(snakeCase(`${BackOffice.name}DbPostgres`)),
      }
    );

    return { instance, secret };
  }

  private service(
    vpc: Vpc,
    bucket: Bucket,
    database: {
      instance: DatabaseInstance;
      secret: aws_rds.DatabaseSecret;
    }
  ) {
    const containerPort = CONTAINER_PORT ? parseInt(CONTAINER_PORT, 10) : 8055;

    const cluster = new aws_ecs.Cluster(
      this,
      BaseBuilder.getConstructName(`${BackOffice.name}Cluster`),
      {
        vpc,
        clusterName: BaseBuilder.getStatefulResourceName(`${BackOffice.name}Cluster`),
      }
    );

    const secret = new aws_secretsmanager.Secret(
      this,
      BaseBuilder.getConstructName(`${BackOffice.name}ServiceSecret`),
      {
        secretName: BaseBuilder.getStatefulResourceName(`${BackOffice.name}ServiceSecret`),
        secretObjectValue: {
          key: SecretValue.unsafePlainText(KEY),
          secret: SecretValue.unsafePlainText(SECRET),
          email: SecretValue.unsafePlainText(ADMIN_EMAIL),
          password: SecretValue.unsafePlainText(ADMIN_PASSWORD),
        },
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
            STORAGE_LOCATIONS: 's3',
            STORAGE_S3_DRIVER: 's3',
            STORAGE_S3_BUCKET: bucket.bucketName,
            STORAGE_S3_REGION: this.region,
          },
          secrets: {
            KEY: aws_ecs.Secret.fromSecretsManager(secret, 'key'),
            SECRET: aws_ecs.Secret.fromSecretsManager(secret, 'secret'),
            ADMIN_EMAIL: aws_ecs.Secret.fromSecretsManager(secret, 'email'),
            ADMIN_PASSWORD: aws_ecs.Secret.fromSecretsManager(secret, 'password'),
            DB_CLIENT: aws_ecs.Secret.fromSecretsManager(database.secret, 'engine'),
            DB_HOST: aws_ecs.Secret.fromSecretsManager(database.secret, 'host'),
            DB_PORT: aws_ecs.Secret.fromSecretsManager(database.secret, 'port'),
            DB_DATABASE: aws_ecs.Secret.fromSecretsManager(database.secret, 'dbname'),
            DB_USER: aws_ecs.Secret.fromSecretsManager(database.secret, 'username'),
            DB_PASSWORD: aws_ecs.Secret.fromSecretsManager(database.secret, 'password'),
          },
        },
        cpu: 256,
        memoryLimitMiB: 512,
        desiredCount: 1,
        publicLoadBalancer: true,
        capacityProviderStrategies: [{ capacityProvider: 'FARGATE_SPOT', weight: 1 }],
      }
    );

    // fargateService.service.autoScaleTaskCount({
    //   minCapacity: 1,
    //   maxCapacity: 1,
    // });

    bucket.grantReadWrite(fargateService.taskDefinition.taskRole);

    database.instance.connections.allowDefaultPortFrom(fargateService.service.connections);

    fargateService.targetGroup.configureHealthCheck({
      path: '/server/health',
      port: containerPort?.toString(),
    });

    return fargateService;
  }
}
