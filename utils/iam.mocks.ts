import {
  GetRoleCommand,
  IAMClient,
  ListRolesCommand,
  Role,
} from '@aws-sdk/client-iam';
import { faker } from '@faker-js/faker';
import { mockClient } from 'aws-sdk-client-mock';

export class IAM {
  client = mockClient(IAMClient);
  roles: Role[] = [];

  createRandomRole(roleName?: string): Role {
    const name = roleName || faker.random.word();
    return {
      RoleName: name,
      RoleId: faker.random.word(),
      Path: '/',
      Arn: `${name}:arn`,
      CreateDate: faker.date.recent(),
    };
  }

  withRole(role?: Role) {
    if (role === undefined) {
      role = this.createRandomRole();
    }

    this.roles.push(role);

    return this;
  }

  restore() {
    this.client.reset();

    return this;
  }

  build() {
    this.client.on(ListRolesCommand).resolves({ Roles: this.roles });

    for (const role of this.roles) {
      this.client.on(GetRoleCommand).resolvesOnce({ Role: role });
    }

    return this;
  }
}
