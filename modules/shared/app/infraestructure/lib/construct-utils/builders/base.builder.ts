import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import _ from 'lodash';
import { resolve } from 'path';
import dynamicResourcesJson from '../../../../../../../deploy-config/dynamic-resources.json';
import { Configurations } from '../../../../../configurations';

const { npm_config_argv } = Configurations.getEnvs();

export abstract class BaseBuilder<T> extends Construct {
  constructor(scope: Construct, protected readonly name: string, protected readonly props: T) {
    super(scope, name);
  }

  protected abstract build(): void;

  protected isActive(resourceType: string): boolean {
    if (npm_config_argv?.includes('generate:dist')) return true;

    const path = [this.packageName, resourceType].join('.');

    const resourcePathValue = _.get(dynamicResourcesJson, path)?.find(
      (resourceName: string) => resourceName === this.name
    );

    return Boolean(resourcePathValue);
  }

  private get packageName() {
    const packageJsonPath = resolve(process.cwd(), 'package.json');

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.name;
  }
}
