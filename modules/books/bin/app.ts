#!/usr/bin/env node

import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { Configurations } from '../../shared/configurations';
import { BookStack } from '../app/lib/stack';

const app = new App();

Configurations.setDefaulTags(app);

new BookStack(app, Configurations.getUserStackName(BookStack.name));
