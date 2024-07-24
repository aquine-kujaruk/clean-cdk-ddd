import { PolicyDocument } from 'aws-lambda';
import { APIGatewayAuthorizerResult } from 'aws-lambda/trigger/api-gateway-authorizer';
import { ulid } from 'ulidx';

export const handler = async function (event: any): Promise<APIGatewayAuthorizerResult> {
  console.log('Functions params: ', JSON.stringify(event, null, 2));

  const authToken = event.headers['authorization'] || '';
  try {
    // Decode the JWT token and verify it

    const policyDocument: PolicyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow', // return Deny if you want to reject the request
          Resource: event['methodArn'],
        },
      ],
    };

    const context = {
      bookId: 123,
      companyId: 456,
      role: 'ADMIN',
      authToken
    };

    const response: APIGatewayAuthorizerResult = {
    //   principalId: decodedJWT.sub,
      principalId: ulid(),
      policyDocument,
      context,
    };
    console.log('Request authorized', JSON.stringify(response, null, 2));

    return response;
  } catch (err) {
    console.error('Unauthorized Request', err);
    throw new Error('Unauthorized');
  }
};
