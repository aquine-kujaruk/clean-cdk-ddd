import {
  AccessLogFormat,
  ApiKey,
  ApiKeySourceType,
  Cors,
  EndpointType,
  IResource,
  LogGroupLogDestination,
  RestApi,
  RestApiProps,
  UsagePlan,
} from 'aws-cdk-lib/aws-apigateway';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';
import _ from 'lodash';
import { Configurations } from '../../../../../configurations';
import { getConstructName, getStatelessResourceName } from '../resource-names';
import {
  RestApiAppControllersType,
  RestApiIntegrationProps,
  RestApiRouteType,
} from '../rest-apis/rest-api.types';
import { BaseBuilder } from './base.builder';
import { LogGroupBuilderConstruct } from './log-group.builder';

const { STAGE } = Configurations.getEnvs();

type RestApiBuilderConstructProps<T extends string | number | symbol> = {
  apiRoutes: RestApiRouteType<T>;
  appRoutes: RestApiAppControllersType<T>;
  apiEventSource: string;
  apiKeyValue?: string;
} & RestApiProps;

export class RestApiBuilderConstruct<T extends string | number | symbol> extends BaseBuilder<
  RestApiBuilderConstructProps<T>
> {
  public api: RestApi;

  constructor(scope: Construct, name: string, props: RestApiBuilderConstructProps<T>) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getStatelessResourceName(this.name);
  }

  protected build() {
    const restApiName = getStatelessResourceName(this.name);
    const { logGroup } = new LogGroupBuilderConstruct(this, `/aws/api-gateway/${restApiName}`);

    this.api = new RestApi(
      this,
      getConstructName(this.name),
      _.merge(
        {
          restApiName,
          endpointTypes: [EndpointType.REGIONAL],
          defaultCorsPreflightOptions: {
            allowOrigins: Cors.ALL_ORIGINS,
            allowMethods: Cors.ALL_METHODS,
          },
          apiKeySourceType: ApiKeySourceType.HEADER,
          deployOptions: {
            stageName: STAGE,
            accessLogDestination: new LogGroupLogDestination(logGroup),
            accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
            tracingEnabled: true,
          },
        } as Partial<RestApiProps>,
        this.props
      )
    );

    this.createUsagePlan();
    this.createApiRoutes(this.props.apiRoutes);
    this.createApiRoutesMethods(this.props.apiRoutes);
  }

  private createUsagePlan() {
    const usagePlan = new UsagePlan(this, getConstructName(`${this.name}UsagePlan`), {
      apiStages: [{ api: this.api, stage: this.api.deploymentStage }],
    });

    if (this.props.apiKeyValue) {
      const apiKey = new ApiKey(this, getConstructName(`${this.name}ApiKey`), {
        value: this.props.apiKeyValue,
      });
      usagePlan.addApiKey(apiKey);
    }
  }

  private addRoute(
    restApiResource: IResource,
    parts: string[],
    index: number = 0
  ): IResource | undefined {
    if (index >= parts.length) return restApiResource;

    let resource = restApiResource.getResource(parts[index]);

    if (!resource) resource = restApiResource.addResource(parts[index]);

    return this.addRoute(resource, parts, index + 1);
  }

  private createApiRoutes(routes: RestApiRouteType<T>) {
    const paths = Object.keys(routes);

    for (const path of paths) {
      const segment = path.split('/').filter((part) => part);
      this.addRoute(this.api.root, segment);
    }
  }

  private createApiRoutesMethods(routes: RestApiRouteType<T>) {
    for (const path in routes) {
      for (const method in routes[path]) {
        const restApiIntegrationProps: RestApiIntegrationProps = {
          api: this.api,
          path,
          httpMethod: method as HttpMethod,
          apiEventSource: this.props.apiEventSource,
        };

        const request = (routes as any)[path]?.[method];

        if (!request) continue;

        (this.props.appRoutes as any)[request]?.(this, restApiIntegrationProps);
      }
    }
  }
}
