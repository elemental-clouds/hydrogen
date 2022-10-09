import {
  KeyMetadata,
  KMSClient,
  ListKeysCommand,
  DescribeKeyCommand,
  GetKeyRotationStatusCommand,
} from '@aws-sdk/client-kms';
import { mockClient } from 'aws-sdk-client-mock';
import { faker } from '@faker-js/faker';
import assert from 'assert';

interface KeyRotationStatuses {
  keyId: string;
  status: boolean;
}

export class KMS {
  kms = mockClient(KMSClient);
  keys?: KeyMetadata[];
  keyRotationStatuses?: KeyRotationStatuses[];

  restore() {
    this.kms.reset();

    return this;
  }

  withKey(
    key: KeyMetadata = { KeyId: faker.datatype.uuid() },
    status: KeyRotationStatuses
  ) {
    if (this.keys === undefined) {
      this.keys = [];
    }

    if (this.keyRotationStatuses === undefined) {
      this.keyRotationStatuses = [];
    }

    this.keys.push(key);
    this.keyRotationStatuses.push(status);

    return this;
  }

  withCustomerKey(keyId: string, status: boolean) {
    this.withKey({ KeyId: keyId, KeyManager: 'CUSTOMER' }, { keyId, status });

    return this;
  }

  withCmkWithOutRotation(keyId = faker.datatype.uuid()) {
    this.withCustomerKey(keyId, false);

    return this;
  }

  withAwsKey(keyId = faker.datatype.uuid()) {
    const key = { KeyId: keyId, KeyManager: 'AWS' };
    const status = { keyId, status: true };
    this.withKey(key, status);

    return this;
  }

  build() {
    this.kms.on(ListKeysCommand).resolves({});

    if (this.keys) {
      this.kms.on(ListKeysCommand).resolves({ Keys: this.keys });

      for (const key of this.keys) {
        this.kms
          .on(DescribeKeyCommand, { KeyId: key.KeyId })
          .resolves({ KeyMetadata: key });

        assert(this.keyRotationStatuses, 'missing key rotations statuses');

        const keyStatus = this.keyRotationStatuses.find(
          status => status.keyId === key.KeyId
        );

        assert(keyStatus, 'missing key rotations status');

        this.kms
          .on(GetKeyRotationStatusCommand, { KeyId: key.KeyId })
          .resolves({ KeyRotationEnabled: keyStatus.status });
      }
    }

    return this;
  }
}
