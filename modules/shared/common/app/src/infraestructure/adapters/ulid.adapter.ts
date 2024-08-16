import { ulid } from 'ulidx';

export class UlidAdapter {
  static generateUlid(): string {
    return ulid().toLowerCase();
  }
}
