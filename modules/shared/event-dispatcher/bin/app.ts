#!/usr/bin/env node

import { Configurations } from '../../configurations';
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { EventDispatcherStack } from '../app/lib/stack';

const app = new App();

Configurations.setDefaulTags(app);

new EventDispatcherStack(app, Configurations.getStaticStackName(EventDispatcherStack.name));
