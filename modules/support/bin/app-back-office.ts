#!/usr/bin/env node

import { Configurations } from '@modules/shared/configurations';
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { BackOffice } from '../app/back-office';

const app = new App();

Configurations.setDefaulTags(app);

new BackOffice(app, Configurations.getStaticStackName(BackOffice.name));
