#!/usr/bin/env node

import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { Configurations } from '../configurations';
import { SharedStack } from '../app';

const app = new App();

Configurations.setDefaulTags(app);

new SharedStack(app, Configurations.getStaticStackName(SharedStack.name));
