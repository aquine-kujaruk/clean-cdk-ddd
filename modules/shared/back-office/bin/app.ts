#!/usr/bin/env node

import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { Configurations } from '../../configurations';
import { BackOfficeStack } from '../app/lib/stack';

const app = new App();

Configurations.setDefaulTags(app);

const { AWS_ACCOUNT_ID, AWS_REGION } = Configurations.getEnvs();

new BackOfficeStack(app, Configurations.getDynamicStackName(BackOfficeStack.name), {
  env: {
    account: AWS_ACCOUNT_ID,
    region: AWS_REGION,
  },
});
