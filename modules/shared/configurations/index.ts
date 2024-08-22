import { App, Tags } from 'aws-cdk-lib';
import { camelCase } from 'change-case-all';
import dotenv from 'dotenv';
import path from 'path';


const envs = path.resolve(__dirname, '../../../.env')
dotenv.config({ path: envs });

export type EnvVars = {
  [key: string]: string;
};

export class Configurations {
  static getEnvs(): EnvVars {
    const book =
      process.env.CDK_USER ||
      process.env.USER ||
      process.env.USERNAME ||
      process.env.LOGNAME ||
      'unknown';

    return {
      ...process.env,
      USER: camelCase(book),
    };
  }

  static setDefaulTags(app: App) {
    const tags = [
      { key: 'appName', value: Configurations.getEnvs()?.APP_NAME as string },
      { key: 'environment', value: Configurations.getEnvs()?.STAGE as string },
      { key: 'user', value: Configurations.getEnvs()?.USER as string },
      { key: 'Medio', value: 'El País' },
      { key: 'Pais', value: 'ES' },
      { key: 'Owner', value: 'aabalo@prisanoticias.com' },
      { key: 'Financiero', value: 'arcsubscriptions' },
      { key: 'Funcion', value: 'SecretsManager' },
      { key: 'Cuenta', value: 'prisaprensades' },
      { key: 'Entorno', value: 'int' },
      { key: 'Proyecto', value: 'arcsubscriptions' },
      { key: 'Creator', value: Configurations.getEnvs()?.USER as string },
      { key: 'UN', value: 'Prisamedia' },
    ];

    return tags.forEach((tag) => Tags.of(app).add(tag.key, tag.value));
  }

  static getUserStackName(name: string) {
    return `${Configurations.getEnvs()?.APP_NAME}-${name}-${Configurations.getEnvs()?.USER}`;
  }

  static getCommonStackName(name: string) {
    return `${Configurations.getEnvs()?.APP_NAME}-${name}-${Configurations.getEnvs()?.STAGE}`;
  }
}
