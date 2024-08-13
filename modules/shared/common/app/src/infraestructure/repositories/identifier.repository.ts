import { IIdentifierRepository } from "../../application/contracts/identifier.contract";
import { UuidAdapter } from "../adapters/uuid.adapter";

export class IdentifierRepository implements IIdentifierRepository {
  generate() {
    return UuidAdapter.generatev4();
  }
}
