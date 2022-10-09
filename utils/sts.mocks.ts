import * as utils from './utils.mocks';
import {
  GetCallerIdentityResponse,
  GetCallerIdentityCommand,
  STSClient,
} from '@aws-sdk/client-sts';
import { mockClient } from 'aws-sdk-client-mock';

export class STS {
  sts = mockClient(STSClient);
  accountId?: string;

  withAccount(accountId = utils.createRandomAccountId()): this {
    this.accountId = accountId;

    this.withGetCallerIdentityResponse({ Account: accountId });

    return this;
  }

  withGetCallerIdentityResponse(response: GetCallerIdentityResponse): this {
    this.sts.on(GetCallerIdentityCommand).resolves(response);

    return this;
  }

  restore(): this {
    this.sts.restore();

    return this;
  }
}
