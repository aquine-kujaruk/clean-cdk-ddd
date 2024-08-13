import { IRole, Role, RoleProps } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import _ from 'lodash';
import { getConstructName, getUniqueConstructName, getStatefulResourceName } from '../resource-names';
import { BaseBuilder } from './base.builder';

interface RoleBuilderConstructProps extends RoleProps {}

export class RoleBuilderConstruct extends BaseBuilder<RoleBuilderConstructProps> {
  public role: Role;

  constructor(scope: Construct, name: string, props: RoleBuilderConstructProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getStatefulResourceName(this.name);
  }

  public static getImportedResource(scope: Construct): IRole {
    return Role.fromRoleName(
      scope,
      getUniqueConstructName(this.name),
      this.resourceName
    );
  }

  public build() {
    this.role = new Role(
      this,
      getConstructName(this.name),
      _.merge(
        {
          roleName: getStatefulResourceName(this.name),
        } as Partial<RoleProps>,
        this.props
      )
    );
    console.log('getStatefulResourceName(this.name): ', getStatefulResourceName(this.name));
  }
}
