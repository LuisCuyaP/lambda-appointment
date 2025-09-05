import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import openapi from '../../docs/openapi.json';

export const handler: APIGatewayProxyHandlerV2 = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(openapi),
});
