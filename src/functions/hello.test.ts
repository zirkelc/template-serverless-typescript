import type { Context } from 'aws-lambda';
import { describe, expect, test } from 'vitest';
import { handler } from './hello.js';

const context: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'hello',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:hello',
  memoryLimitInMB: '1024',
  awsRequestId: '1234567890',
  logGroupName: '/aws/lambda/hello',
  logStreamName: '2021/01/01/[$LATEST]1234567890',
  getRemainingTimeInMillis: () => 1000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

describe('hello', () => {
  test('should return a 200 status code', async () => {
    const result = await handler({}, context, () => {});
    expect(result.statusCode).toBe(200);
  });
});
