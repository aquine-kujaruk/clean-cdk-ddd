import { v4 as uuidv4 } from 'uuid';

export class UuidAdapter {
  static generatev4(): string {
    return uuidv4();
  }
}