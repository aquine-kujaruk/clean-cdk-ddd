#!/usr/bin/env node

import { Configurations } from '@modules/shared/configurations';
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { BackOffice } from '../app/back-office/back-office.stack';

const app = new App();

Configurations.setDefaulTags(app);

const { AWS_ACCOUNT_ID, AWS_REGION } = Configurations.getEnvs();

new BackOffice(app, Configurations.getStaticStackName(BackOffice.name), {
  env: {
    account: AWS_ACCOUNT_ID,
    region: AWS_REGION,
  },
});
