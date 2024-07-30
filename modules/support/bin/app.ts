#!/usr/bin/env node

import { Configurations } from '@modules/shared/configurations';
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { SupportStack } from '../app/support.stack';

const app = new App();

Configurations.setDefaulTags(app);

new SupportStack(app, Configurations.getDynamicStackName(SupportStack.name));
