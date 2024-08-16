import { IIdentifierRepository } from '../../application/contracts/identifier.contract';
import { UlidAdapter } from '../adapters/ulid.adapter';

export class IdentifierRepository implements IIdentifierRepository {
  generate() {
    return UlidAdapter.generateUlid();
  }
}
