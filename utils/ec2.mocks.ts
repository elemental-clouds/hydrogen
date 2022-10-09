import assert from 'assert';
import { AwsError, mockClient } from 'aws-sdk-client-mock';
import { faker } from '@faker-js/faker';
import {
  DescribeRegionsCommand,
  DescribeSnapshotAttributeCommand,
  DescribeSnapshotAttributeResult,
  DescribeSnapshotsCommand,
  EC2Client,
  Region,
  Snapshot,
} from '@aws-sdk/client-ec2';

export class EC2 {
  ec2 = mockClient(EC2Client);

  describeError?: { err: unknown; snapshotId: string }[];
  attributes: DescribeSnapshotAttributeResult[] = [];
  regions: Region[] = [];
  snapshots?: Snapshot[];

  restore() {
    this.ec2.reset();

    return this;
  }

  generateSnapshotAttributes(snapshotId?: string) {
    return {
      SnapshotId: snapshotId || faker.random.word(),
    };
  }

  generateSnapshot(snapshotId?: string) {
    return { SnapshotId: snapshotId || faker.random.word() };
  }

  withSnapshot(
    snapshot: Snapshot = this.generateSnapshot(),
    attributes: DescribeSnapshotAttributeResult
  ) {
    if (this.snapshots === undefined) {
      this.snapshots = [];
    }
    this.snapshots.push(snapshot);

    this.attributes.push(attributes);

    return this;
  }

  withDescribeError(err: unknown, snapshotId = faker.random.word()) {
    this.withPriSnapshot({ SnapshotId: snapshotId });

    if (this.describeError === undefined) {
      this.describeError = [];
    }

    this.describeError.push({ err, snapshotId });

    return this;
  }

  withNoPermissionSnapshot(snapshot: Snapshot = this.generateSnapshot()) {
    const attributes = {
      SnapshotId: snapshot.SnapshotId,
    };

    this.withSnapshot(snapshot, attributes);

    return this;
  }

  withSharedToSpecificAccountSnapshot(
    snapshot: Snapshot = this.generateSnapshot(),
    account = faker.random.word()
  ) {
    const attributes = {
      SnapshotId: snapshot.SnapshotId,
      CreateVolumePermissions: [{ UserId: account }],
    };

    this.withSnapshot(snapshot, attributes);

    return this;
  }

  withPubSnapshot(snapshot: Snapshot = this.generateSnapshot()) {
    const attributes = {
      SnapshotId: snapshot.SnapshotId,
      CreateVolumePermissions: [{ Group: 'all' }],
    };

    this.withSnapshot(snapshot, attributes);

    return this;
  }

  withSnapshotWithNoPermissions(snapshot: Snapshot = this.generateSnapshot()) {
    this.withSnapshot(snapshot, { SnapshotId: snapshot.SnapshotId });

    return this;
  }

  withPriSnapshot(snapshot: Snapshot = this.generateSnapshot()) {
    const attributes = {
      SnapshotId: snapshot.SnapshotId,
      CreateVolumePermissions: [],
    };

    this.withSnapshot(snapshot, attributes);

    return this;
  }

  build() {
    this.ec2.on(DescribeSnapshotsCommand).resolves({});

    if (this.snapshots) {
      this.ec2.on(DescribeSnapshotsCommand).resolves({
        Snapshots: this.snapshots,
      });

      this.snapshots.forEach(snapshot => {
        const attribute = this.attributes.find(
          attribute => attribute.SnapshotId === snapshot.SnapshotId
        );

        assert(attribute);
        assert(snapshot.SnapshotId);

        let err;
        if (this.describeError) {
          err = this.describeError.find(
            errs => errs.snapshotId === snapshot.SnapshotId
          );
        }

        if (err) {
          this.ec2
            .on(DescribeSnapshotsCommand, {
              SnapshotIds: [snapshot.SnapshotId],
            })
            .rejects(err.err as AwsError);
        } else {
          this.ec2
            .on(DescribeSnapshotsCommand, {
              SnapshotIds: [snapshot.SnapshotId],
            })
            .resolves({
              Snapshots: [snapshot],
            });
        }

        this.ec2
          .on(DescribeSnapshotAttributeCommand, {
            SnapshotId: snapshot.SnapshotId,
          })
          .resolves(attribute);
      });
    }

    this.ec2.on(DescribeRegionsCommand).resolves({ Regions: this.regions });

    return this;
  }
}
