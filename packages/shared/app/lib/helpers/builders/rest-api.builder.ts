import {
  AccessLogFormat,
  ApiKey,
  ApiKeySourceType,
  Cors,
  IResource,
  LogGroupLogDestination,
  RestApi,
  RestApiProps,
  UsagePlan,
} from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import _ from 'lodash';
import { Configurations } from '../../../../configurations';
import {
  RestApiAppRoutesType,
  RestApiIntegrationProps,
  RestApiRouteType,
} from '../rest-apis/rest-api.types';
import { BaseBuilder } from './base.builder';
import { LogGroupBuilderConstruct } from './log-group.builder';

const { STAGE } = Configurations.getEnvs();

type RestApiBuilderConstructProps<T extends string | number | symbol> = {
  apiRoutes: RestApiRouteType<T>[];
  appRoutes: RestApiAppRoutesType<T>;
  apiEventSource: string;
  apiKeyValue?: string;
} & RestApiProps;

export class RestApiBuilderConstruct<T extends string | number | symbol > extends BaseBuilder<
  RestApi,
  RestApiBuilderConstructProps<T>
> {
  constructor(scope: Construct, id: string, props: RestApiBuilderConstructProps<T>) {
    super(scope, id, props);
  }

  public static getResourceName(name: string): string {
    return RestApiBuilderConstruct.getStatelessResourceName(name);
  }

  protected build(): RestApi {
    const restApiName = RestApiBuilderConstruct.getResourceName(this.id);

    const logGroup = LogGroupBuilderConstruct.createResource(
      this,
      `/aws/api-gateway/${restApiName}`
    );

    const api = new RestApi(
      this,
      RestApiBuilderConstruct.getConstructName(this.id),
      _.merge(
        {
          restApiName,
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

    this.createUsagePlan(api);
    this.createApiRoutes(api, this.props.apiRoutes as RestApiRouteType<T>[]);
    this.createApiRoutesMethods(api, this.props.apiRoutes as RestApiRouteType<T>[]);

    return api;
  }

  private createUsagePlan(api: RestApi) {
    const usagePlan = new UsagePlan(this, BaseBuilder.getConstructName(`${this.id}UsagePlan`), {
      apiStages: [{ api, stage: api.deploymentStage }],
    });

    if (this.props.apiKeyValue) {
      const apiKey = new ApiKey(this, BaseBuilder.getConstructName(`${this.id}ApiKey`), {
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

  private createApiRoutes(api: RestApi, routes: RestApiRouteType<T>[]) {
    const paths = [...new Set(routes.map(({ path }) => path))];

    for (const path of paths) {
      const segment = path.split('/').filter((part) => part);
      this.addRoute(api.root, segment);
    }
  }

  private createApiRoutesMethods(api: RestApi, routes: RestApiRouteType<T>[]) {
    for (const route of routes) {
      for (const method of route.methods) {
        const restApiIntegrationProps: RestApiIntegrationProps = {
          api,
          path: route.path,
          httpMethod: method,
          apiEventSource: this.props.apiEventSource,
        };

        this.props.appRoutes[route.request]?.[method]?.(this, restApiIntegrationProps);
      }
    }
  }
}
