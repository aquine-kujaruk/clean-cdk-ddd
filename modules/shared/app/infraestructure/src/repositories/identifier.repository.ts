import { UuidAdapter } from '@modules/shared/app/infraestructure/src/adapters/uuid.adapter';
import { IIdentifierRepository } from '../../../application/src/contracts/identifier.contract';

export class IdentifierRepository implements IIdentifierRepository {
  generate() {
    return UuidAdapter.generatev4();
  }
}
