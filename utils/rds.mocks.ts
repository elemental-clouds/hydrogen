import { mockClient } from 'aws-sdk-client-mock';
import {
  DBInstance,
  DBCluster,
  DescribeDBInstancesCommand,
  RDSClient as Client,
  DescribeDBClustersCommand,
} from '@aws-sdk/client-rds';
export class RDS {
  client = mockClient(Client);
  instances: DBInstance[] = [];
  clusters: DBCluster[] = [];

  restore() {
    this.client.reset();

    return this;
  }

  withDBInstance(dbInstance: DBInstance) {
    this.instances.push(dbInstance);

    return this;
  }

  withDBCluster(dbCluster: DBCluster) {
    this.clusters.push(dbCluster);

    return this;
  }

  build() {
    this.client
      .on(DescribeDBInstancesCommand)
      .resolves({ DBInstances: this.instances });

    this.client
      .on(DescribeDBClustersCommand)
      .resolves({ DBClusters: this.clusters });

    return this;
  }
}
