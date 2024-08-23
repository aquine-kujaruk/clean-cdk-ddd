import { getSecret } from '@aws-lambda-powertools/parameters/secrets';
import { SecretsManagerClient, UpdateSecretCommand } from '@aws-sdk/client-secrets-manager';

const secretsManagerClient = new SecretsManagerClient();
const appSecretName = process.env.APP_SECRETS_NAME as string;
const maxAge = 60; // 1 minute

export class AwsSecretManagerAdapter {
  static async getAppSecrets() {
    try {
      const secretString = (await getSecret(appSecretName, { maxAge })) as string;

      try {
        return JSON.parse(secretString);
      } catch (error: any) {
        if (error.name !== 'SyntaxError') throw error;
      }

      return {};
    } catch (error: any) {
      throw new Error(
        `[SecretManagerAdapter] [getSecretValueFromJson]: Error on fetch secret ${appSecretName}:  ${error}`
      );
    }
  }

  private static async updateSecret(SecretString: string) {
    const params = { SecretId: appSecretName, SecretString };

    const command = new UpdateSecretCommand(params);

    try {
      await secretsManagerClient.send(command);
    } catch (error) {
      console.error(
        `[SecretManagerAdapter] [updateSecret]: Error on update secret ${appSecretName} with value ${SecretString}`,
        error
      );
    }
  }

  static async updateAppSecrets(secretsToUpdate: Record<string, string>) {
    const secrets = await AwsSecretManagerAdapter.getAppSecrets();

    const secretString = JSON.stringify({ ...secrets, ...secretsToUpdate });

    await AwsSecretManagerAdapter.updateSecret(secretString);
  }
}
