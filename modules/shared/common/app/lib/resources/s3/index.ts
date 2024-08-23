import { Construct } from 'constructs';
import { BackOfficeBucket } from './buckets/back-office.bucket';

export class S3 {
  constructor(scope: Construct) {
    new BackOfficeBucket(scope);
  }
}
