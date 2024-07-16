import { generateUserIdentifierWithEntityPrefix } from "../value-objects/generate-user-identifier";

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly timestamp: number
  ) {}

  static fromJson({ name, id, timestamp }: Record<string, any>): User {
    return new User(
      generateUserIdentifierWithEntityPrefix(id),
      name,
      timestamp
    );
  }
}
