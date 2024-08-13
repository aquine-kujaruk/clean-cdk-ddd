#!/usr/bin/env node

import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { Configurations } from '../../configurations';
import { RestApisStack } from '../app/lib/stack';

const app = new App();

Configurations.setDefaulTags(app);

new RestApisStack(app, Configurations.getDynamicStackName(RestApisStack.name));
