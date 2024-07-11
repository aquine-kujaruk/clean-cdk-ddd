#!/usr/bin/env node

import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { Configurations } from '@packages/shared/configurations';
import { SupportStack } from '../app/support.stack';

const app = new App();

Configurations.setDefaulTags(app);

new SupportStack(app, Configurations.getDynamicStackName(SupportStack.name));
