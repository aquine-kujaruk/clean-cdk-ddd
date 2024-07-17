import { IdentifierRepository } from '../../../domain/src/contracts/identifier.repository';
import { UuidAdapter } from '@modules/shared/app/src/infraestructure/adapters/uuid.adapter';

export class UuidRepository implements IdentifierRepository {
  generate() {
    return UuidAdapter.generatev4();
  }
}
