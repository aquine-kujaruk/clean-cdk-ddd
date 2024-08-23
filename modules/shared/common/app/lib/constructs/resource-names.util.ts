import { camelCase, pascalCase } from 'change-case-all';
import { ulid } from 'ulidx';
import { Configurations } from '../../../../configurations';

const { APP_NAME, USER, STAGE } = Configurations.getEnvs();

export const getConstructName = (name: string) => {
  return pascalCase(name);
};

export const getUniqueConstructName = (name: string) => {
  return pascalCase(name) + ulid();
};

export const getCommonResourceName = (name: string) => {
  const splittedName = name.split('_');
  const identifier = splittedName.map((text) => camelCase(text)).join('_');

  return `${APP_NAME}-${identifier}-${STAGE}`;
};

export const getUserResourceName = (name: string) => {
  const splittedName = name.split('_');
  const identifier = splittedName.map((text) => camelCase(text)).join('_');

  return `${APP_NAME}-${identifier}-${USER}`;
};
