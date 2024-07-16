#!/usr/bin/env node

import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { Configurations } from '@modules/shared/configurations';
import { SupportStack } from '../app';

const app = new App();

Configurations.setDefaulTags(app);

new SupportStack(app, Configurations.getDynamicStackName(SupportStack.name));
