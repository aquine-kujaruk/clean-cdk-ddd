#!/usr/bin/env node

import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { Configurations } from '../../configurations';
import { ApisStack } from '../app/lib/stack';

const app = new App();

Configurations.setDefaulTags(app);

new ApisStack(app, Configurations.getUserStackName(ApisStack.name));
/*  */