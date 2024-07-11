import { Construct } from 'constructs';
import { Backups } from './backups.bucket';
import { Collectives } from './collectives.bucket';
import { Datafrombundlecodes } from './datafrombundlecodes.bucket';
import { Docgenerator } from './docgenerator.bucket';
import { Estaticos } from './estaticos.bucket';
import { Financial } from './financial.bucket';
import { Logs } from './logs.bucket';
import { Lta } from './lta.bucket';
import { MerchantOrder } from './merchantorder.bucket';
import { Refund } from './refund.bucket';
import { Users } from './users.bucket';

export class Buckets {
  constructor(scope: Construct) {
    new Backups(scope);
    new Collectives(scope);
    new Datafrombundlecodes(scope);
    new Docgenerator(scope);
    new Estaticos(scope);
    new Financial(scope);
    new Logs(scope);
    new Lta(scope);
    new MerchantOrder(scope);
    new Refund(scope);
    new Users(scope);
  }
}
