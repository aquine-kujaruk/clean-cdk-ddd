import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { RestApiRouteType } from '@packages/shared/app/lib/helpers/rest-apis/rest-api.types';
import { AppRequests, AppRequestType } from '../../app.requests';

const routes: RestApiRouteType<AppRequestType>[] = [
  {
    request: AppRequests.CREATE_USER,
    path: 'user/command/create-user',
    methods: [HttpMethod.POST],
  },
  {
    request: AppRequests.GIFT_REDEEMED,
    path: 'user/event/create-user',
    methods: [HttpMethod.POST],
  },
];

export default routes;
