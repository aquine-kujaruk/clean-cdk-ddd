import { Construct } from 'constructs';
import { BackOfficeBucket } from './buckets/back-office.bucket';

export class Buckets {
  constructor(scope: Construct) {
    new BackOfficeBucket(scope);
  }
}
