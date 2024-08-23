import {
  AccessLogFormat,
  ApiKey,
  ApiKeySourceType,
  Cors,
  EndpointType,
  IResource,
  IRestApi,
  LogGroupLogDestination,
  RestApi,
  RestApiProps,
  UsagePlan,
} from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import _ from 'lodash';
import { Configurations } from '../../../../../configurations';
import { parseApiPath } from './parse-api-path.util';
import {
  getConstructName,
  getUniqueConstructName,
  getUserResourceName,
} from '../resource-names.util';
import {
  CommandQueryType,
  RestApiEndpoint,
  RestApiEndpointDefinition,
  RestApiIntegrationProps,
} from './rest-api.types';
import { BaseConstruct } from '../base.construct';
import { AuthorizerFunctionConstruct } from './authorizer-function.construct';
import { LogGroupConstruct } from '../cloud-watch/log-group.construct';

const { STAGE } = Configurations.getEnvs();

type RestApiConstructProps = {
  commands?: CommandQueryType[];
  queries?: CommandQueryType[];
  authorizers?: AuthorizerFunctionConstruct[];
  apiEventSource?: string;
  apiKeyValue?: string;
} & RestApiProps;

export class RestApiConstruct extends BaseConstruct<RestApiConstructProps> {
  public api: RestApi;

  constructor(scope: Construct, name: string, props: RestApiConstructProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getUserResourceName(this.name);
  }

  public static getImportedResource(scope: Construct, restApiId: string): IRestApi {
    return RestApi.fromRestApiId(scope, getUniqueConstructName(this.name), restApiId);
  }

  protected build() {
    const restApiName = getUserResourceName(this.name);
    const { logGroup } = new LogGroupConstruct(this, `/aws/api-gateway/${restApiName}`);

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

    const endpoints = this.getEndpoints();

    for (const endpoint of endpoints) {
      this.createEndpointUrl(endpoint);
      this.createEndpointIntegration(endpoint);
    }
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

  private getEndpoints(): RestApiEndpoint[] {
    const { commands = [], queries = [] } = this.props;

    const commandQueryList = [
      ...commands.map((command) => ({ ...command, resource: `command/${command.resource}` })),
      ...queries.map((query) => ({ ...query, resource: `query/${query.resource}` })),
    ];

    let endpoints = [];
    for (const { resource, endpointDefinitions } of commandQueryList) {
      for (const definition of endpointDefinitions) {
        endpoints.push(this.getEndpoint(resource, definition));
      }
    }

    return endpoints.filter(Boolean) as RestApiEndpoint[];
  }

  private getEndpoint(
    resource: string,
    { apis, path, integration }: RestApiEndpointDefinition
  ): RestApiEndpoint | undefined {
    const isApiRegistered = !!apis.find((api) => api.name === this.name);

    if (!isApiRegistered) return;

    const parsedPath = parseApiPath(path);

    return {
      path: `${resource}${parsedPath.path}`,
      method: parsedPath.method,
      integration,
    };
  }

  private createEndpointUrl({ path }: RestApiEndpoint) {
    const segment = path.split('/').filter((part) => part);
    this.addRoute(this.api.root, segment);
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

  private createEndpointIntegration(endpoint: RestApiEndpoint) {
    const restApiIntegrationProps: RestApiIntegrationProps = {
      api: this.api,
      path: endpoint.path,
      httpMethod: endpoint.method,
      apiEventSource: this.props.apiEventSource || 'REST_API',
      authorizers: this.props.authorizers || [],
    };

    endpoint.integration(this, restApiIntegrationProps);
  }
}
