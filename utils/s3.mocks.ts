import { AwsError, mockClient } from 'aws-sdk-client-mock';
import { faker } from '@faker-js/faker';
import { Region } from '@aws-sdk/client-ec2';
import {
  GetBucketLocationCommand,
  GetPublicAccessBlockCommand,
  ListBucketsCommand,
  PublicAccessBlockConfiguration,
  S3Client,
} from '@aws-sdk/client-s3';

interface MockBucketInterface {
  name: string;
  locationConstraint?: string;
  accessBlockConfiguration?: {
    BlockPublicAcls?: boolean;
    BlockPublicPolicy?: boolean;
    IgnorePublicAcls?: boolean;
    RestrictPublicBuckets?: boolean;
  };
  accessBlockConfigurationErr?: unknown;
}

export class MockBucketBuilder {
  name: string = faker.random.word();
  locationConstraint?: string;
  accessBlocks?: PublicAccessBlockConfiguration;
  blockPublicAcls?: boolean;
  blockPublicPolicy?: boolean;
  ignorePublicAcls?: boolean;
  restrictPublicBuckets?: boolean;
  accessBlockConfiguration?: boolean;
  bucket?: MockBucketInterface;

  withAccessBlockConfiguration() {
    this.accessBlockConfiguration = true;
    return this;
  }

  withBlockPublicAcls(blockPublicAcls: boolean) {
    this.blockPublicAcls = blockPublicAcls;
    return this;
  }

  withBlockPublicPolicy(blockPublicPolicy: boolean) {
    this.blockPublicPolicy = blockPublicPolicy;
    return this;
  }

  withIgnorePublicAcls(ignorePublicAcls: boolean) {
    this.ignorePublicAcls = ignorePublicAcls;
    return this;
  }

  withRestrictPublicBuckets(restrictPublicBuckets: boolean) {
    this.restrictPublicBuckets = restrictPublicBuckets;
    return this;
  }

  withName(name: string) {
    this.name = name;

    return this;
  }

  withLocationConstraint(region = faker.random.word()) {
    this.locationConstraint = region;

    return this;
  }

  build() {
    this.bucket = {
      name: this.name,
      locationConstraint: this.locationConstraint,
    };

    if (this.accessBlockConfiguration === true) {
      this.bucket.accessBlockConfiguration = {
        BlockPublicAcls: this.blockPublicAcls,
        BlockPublicPolicy: this.blockPublicPolicy,
        IgnorePublicAcls: this.ignorePublicAcls,
        RestrictPublicBuckets: this.restrictPublicBuckets,
      };
    }

    return this.bucket;
  }
}

export class S3 {
  s3 = mockClient(S3Client);
  regions: Region[] = [];
  buckets?: MockBucketInterface[];

  restore() {
    this.s3;
    this.s3.reset();

    return this;
  }

  withBucketWithNoAccessBlockConfig(name = faker.random.word()) {
    this.withBucket({
      name,
    });

    return this;
  }

  withBucketWithNoAccessBlockConfigErr(name = faker.random.word()) {
    this.withBucket({
      name,
      accessBlockConfigurationErr: {
        Code: 'NoSuchPublicAccessBlockConfiguration',
      },
    });

    return this;
  }

  withPrivateBucket(name = faker.random.word()) {
    this.withBucket({
      name,
      accessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    });

    return this;
  }

  withBucket(bucket: MockBucketInterface) {
    if (this.buckets === undefined) {
      this.buckets = [];
    }

    this.buckets.push(bucket);

    return this;
  }

  build() {
    this.s3.on(ListBucketsCommand).resolves({});

    if (this.buckets) {
      const _buckets = this.buckets.map(bucket => {
        return { Name: bucket.name };
      });

      this.s3.on(ListBucketsCommand).resolves({
        Buckets: _buckets,
      });

      for (const bucketData of this.buckets) {
        this.s3
          .on(GetBucketLocationCommand, {
            Bucket: bucketData.name,
          })
          .resolves({
            /**
             * buckets in us-east-1 have a undefined location constraint
             * the code uses a truthy check to validate the value exists
             */
            LocationConstraint: bucketData.locationConstraint,
          });

        if (bucketData.accessBlockConfigurationErr) {
          this.s3
            .on(GetPublicAccessBlockCommand, {
              Bucket: bucketData.name,
            })
            .rejects(bucketData.accessBlockConfigurationErr as AwsError);
        } else {
          this.s3
            .on(GetPublicAccessBlockCommand, {
              Bucket: bucketData.name,
            })
            .resolves({
              PublicAccessBlockConfiguration:
                bucketData.accessBlockConfiguration,
            });
        }
      }
    }

    return this;
  }
}
