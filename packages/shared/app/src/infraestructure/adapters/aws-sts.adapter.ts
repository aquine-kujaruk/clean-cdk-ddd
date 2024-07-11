import { STS } from '@aws-sdk/client-sts';

const client = new STS();

export class AwsStsAdapter {
  static async getRuntimeAccount(): Promise<string | undefined> {
    const { Account } = await client.getCallerIdentity({});

    return Account;
  }
}
