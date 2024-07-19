import { UuidAdapter } from '@modules/shared/app/src/infraestructure/adapters/uuid.adapter';
import { IdentifierRepository } from '../../domain/contracts/identifier.repository';

export class UuidRepository implements IdentifierRepository {
  generate() {
    return UuidAdapter.generatev4();
  }
}
