import { IRole, Role, RoleProps } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import _ from 'lodash';
import { BaseBuilder } from './base.builder';

interface RoleBuilderConstructProps extends RoleProps {}

export class RoleBuilderConstruct extends BaseBuilder<Role, RoleBuilderConstructProps> {
  constructor(scope: Construct, id: string, props: RoleBuilderConstructProps) {
    super(scope, id, props);
  }

  public static getResourceName(name: string): string {
    return this.getStatefulResourceName(name);
  }

  public static getImportedResource(scope: Construct, name: string): IRole {
    return Role.fromRoleName(
      scope,
      RoleBuilderConstruct.getConstructName(name),
      RoleBuilderConstruct.getResourceName(name)
    );
  }

  public build(): Role {
    const role = new Role(
      this,
      RoleBuilderConstruct.getConstructName(this.id),
      _.merge(
        {
          roleName: RoleBuilderConstruct.getResourceName(this.id),
        } as Partial<RoleProps>,
        this.props
      )
    );

    return role;
  }
}
