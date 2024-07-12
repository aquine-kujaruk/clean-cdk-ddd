import { Stack } from 'aws-cdk-lib';
import { camelCase, pascalCase } from 'change-case-all';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import _ from 'lodash';
import { resolve } from 'path';
import { ulid } from 'ulidx';
import dynamicResourcesJson from '../../../../../../deploy-config/dynamic-resources.json';
import { Configurations } from '../../../../configurations';

const { APP_NAME, STAGE, USER, npm_config_argv } = Configurations.getEnvs();

export abstract class BaseBuilder<T, P> extends Construct {
  constructor(scope: Construct, protected readonly id: string, protected readonly props: P) {
    super(scope, id);
    this.id = id;
    this.props = props;
  }

  protected abstract build(): T | undefined;

  protected isActive(resourceType: string): boolean {
    if (npm_config_argv?.includes('generate:dist')) return true;

    const path = [this.packageName, resourceType].join('.');

    const resourcePathValue = _.get(dynamicResourcesJson, path)?.find(
      (resourceName: string) => resourceName === this.id
    );

    return Boolean(resourcePathValue);
  }

  private get packageName() {
    const packageJsonPath = resolve(process.cwd(), 'package.json');

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.name;
  }

  public static getConstructName(name: string): string {
    return pascalCase(name);
  }

  protected static getUniqueConstructName(name: string): string {
    return pascalCase(name) + ulid();
  }

  protected static getStatefulResourceName(name: string): string {
    const splittedName = name.split('_');
    const identifier = splittedName.map((text) => camelCase(text)).join('_');

    return `${APP_NAME}-${identifier}-${STAGE}`;
  }

  public static getStatelessResourceName(name: string): string {
    const splittedName = name.split('_');
    const identifier = splittedName.map((text) => camelCase(text)).join('_');

    return `${APP_NAME}-${USER}-${identifier}-${STAGE}`;
  }

  protected static getStack(scope: Construct): Stack {
    return Stack.of(scope);
  }
}
