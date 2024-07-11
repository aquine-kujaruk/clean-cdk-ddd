import { JsonPath } from 'aws-cdk-lib/aws-stepfunctions';
import { camelCase } from 'change-case-all';

export const getExecutionStackPath = <T>(stepName: T, subpath: string) =>
  JsonPath.objectAt(`$.executionStack.${camelCase(stepName as string)}.${subpath}`);
