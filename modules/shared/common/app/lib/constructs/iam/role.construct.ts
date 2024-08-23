import { IRole, Role, RoleProps } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import _ from 'lodash';
import {
  getCommonResourceName,
  getConstructName,
  getUniqueConstructName,
} from '../resource-names.util';
import { BaseConstruct } from '../base.construct';

export class RoleConstruct extends BaseConstruct<RoleProps> {
  public role: Role;

  constructor(scope: Construct, name: string, props: RoleProps) {
    super(scope, name, props);

    this.build();
  }

  public static get resourceName(): string {
    return getCommonResourceName(this.name);
  }

  public static getImportedResource(scope: Construct): IRole {
    return Role.fromRoleName(scope, getUniqueConstructName(this.name), this.resourceName);
  }

  public build() {
    this.role = new Role(
      this,
      getConstructName(this.name),
      _.merge(
        {
          roleName: getCommonResourceName(this.name),
        } as Partial<RoleProps>,
        this.props
      )
    );
  }
}
