#!/usr/bin/env node

import { Configurations } from '@modules/shared/configurations';
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { CoreStack } from '../app/core.stack';

const app = new App();

Configurations.setDefaulTags(app);

new CoreStack(app, Configurations.getDynamicStackName(CoreStack.name));
