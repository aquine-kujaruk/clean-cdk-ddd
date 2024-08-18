import { Construct } from 'constructs';
import { ApisProps } from '../stack';
import { PublicApi } from './public.api';

export class Apis {
  constructor(scope: Construct, props: ApisProps) {
    new PublicApi(scope, props);
  }
}
