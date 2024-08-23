import { getParameter } from '@aws-lambda-powertools/parameters/ssm';

const APP_NAME = process.env.APP_NAME;

const defaultMaxAge = 60; // 1 minute

export class AwsParameterStoreAdapter {
  static async getParameter(env: string, maxAge = defaultMaxAge) {
    const name = `/${APP_NAME}/${env}`;

    try {
      const parameter = await getParameter(name, { maxAge });
      return parameter;
    } catch (error) {
      throw new Error(
        `[ParameterStoreAdapter] [getParameter]: Error on fetch parameters ${env}:  ${error}`
      );
    }
  }
}
