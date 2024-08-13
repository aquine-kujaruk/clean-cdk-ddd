#!/usr/bin/env node

import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { Configurations } from '../../configurations';
import { CommonStack } from '../app/lib/stack';

const app = new App();

Configurations.setDefaulTags(app);

const { AWS_ACCOUNT_ID, AWS_REGION } = Configurations.getEnvs();

new CommonStack(app, Configurations.getStaticStackName(CommonStack.name), {
  env: {
    account: AWS_ACCOUNT_ID,
    region: AWS_REGION,
  },
});
