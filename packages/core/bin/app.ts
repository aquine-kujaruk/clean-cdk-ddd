#!/usr/bin/env node

import { Configurations } from '@packages/shared/configurations';
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { CoreStack } from '../app';

const app = new App();

Configurations.setDefaulTags(app);

new CoreStack(app, Configurations.getDynamicStackName(CoreStack.name));
