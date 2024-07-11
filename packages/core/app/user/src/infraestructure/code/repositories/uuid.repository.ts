import { IdentifierRepository } from '../../../domain/code/repositories/identifier.repository';
import { UuidAdapter } from '@packages/shared/app/src/infraestructure/adapters/uuid.adapter';

export class UuidRepository implements IdentifierRepository {
  generate() {
    return UuidAdapter.generatev4();
  }
}
