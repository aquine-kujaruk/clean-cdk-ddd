import { aws_ecs } from 'aws-cdk-lib';
import {
  ApplicationLoadBalancedFargateService,
  ApplicationLoadBalancedFargateServiceProps,
  ApplicationLoadBalancedTaskImageOptions,
} from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';
import _ from 'lodash';
import { getConstructName, getCommonResourceName } from '../resource-names.util';
import { BaseConstruct } from '../base.construct';
import { EcsTaskRole } from '../../resources/iam/roles/ecs-task.role';

export class FargateServiceConstruct extends BaseConstruct<ApplicationLoadBalancedFargateServiceProps> {
  public fargateService: ApplicationLoadBalancedFargateService;

  constructor(scope: Construct, name: string, props: ApplicationLoadBalancedFargateServiceProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getCommonResourceName(this.name);
  }

  private get runtimePlatform() {
    return {
      operatingSystemFamily: aws_ecs.OperatingSystemFamily.LINUX,
      cpuArchitecture: aws_ecs.CpuArchitecture.X86_64,
    };
  }

  public build() {
    this.fargateService = new ApplicationLoadBalancedFargateService(
      this,
      getConstructName(this.name),
      _.merge(
        {
          serviceName: getCommonResourceName(this.name),
          runtimePlatform: this.runtimePlatform,
          taskImageOptions: {
            taskRole: EcsTaskRole.getImportedResource(this),
          } as ApplicationLoadBalancedTaskImageOptions,
          cpu: 256,
          memoryLimitMiB: 512,
          desiredCount: 1,
          publicLoadBalancer: true,
          capacityProviderStrategies: [{ capacityProvider: 'FARGATE_SPOT', weight: 1 }],
        } as Partial<ApplicationLoadBalancedFargateServiceProps>,
        this.props
      )
    );

    this.fargateService.targetGroup.configureHealthCheck({
      path: '/server/health',
      port: this.props.taskImageOptions?.containerPort?.toString(),
    });
  }
}
