interface EntityConditionalType<T = any> {
  new (...args: any[]): T;
  _isEntity(): typeof BaseEntity;
}

type EnsureIsEntity<T> = T extends EntityConditionalType ? T : never;

export type EntityClassType = EnsureIsEntity<typeof BaseEntity>;

export class BaseEntity {
  public readonly updatedAtUTC?: string;
  public readonly createdAtUTC?: string;

  constructor(..._args: any[]) {}

  static _isEntity() {
    return BaseEntity;
  }
}
