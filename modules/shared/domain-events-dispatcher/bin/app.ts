#!/usr/bin/env node

import { Configurations } from '../../configurations';
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { DomainEventsDispatcherStack } from '../app/lib/stack';

const app = new App();

Configurations.setDefaulTags(app);

new DomainEventsDispatcherStack(app, Configurations.getUserStackName(DomainEventsDispatcherStack.name));
