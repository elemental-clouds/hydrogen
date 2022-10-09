import { Region } from '@aws-sdk/client-ec2/dist-types/models/index';
import { faker } from '@faker-js/faker';

export const utils = {
  ec2: {
    createMixedRegions,
    createRandomMixedOptInRegions,
    createRandomOptInNotRequiredRegion,
    createRandomOptInNotRequiredRegions,
    createRandomOptedInRegion,
    createRandomOptedInRegions,
    createRandomRegion,
    createRandomRegions,
  },
};

export function createRandomRegion(
  endpoint = faker.random.word(),
  regionName = faker.random.word(),
  optInStatus = faker.random.word()
): Region {
  return {
    Endpoint: endpoint,
    RegionName: regionName,
    OptInStatus: optInStatus,
  };
}

export function getSystemVersion() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require('./package.json');
  return packageJson.version;
}

export function createRandomAccountId(): string {
  return [...new Array(12)].map(() => faker.datatype.number(9)).join('');
}

export function createRandomRegions(
  count = faker.datatype.number({ max: 20, min: 2 })
): Region[] {
  const regions: Region[] = [];

  for (let i = 0; i < count; i++) {
    regions.push(createRandomRegion());
  }

  return regions;
}

export function createRandomOptedInRegion(): Region {
  return createRandomRegion(undefined, undefined, 'opted-in');
}

export function createRandomOptInNotRequiredRegion(): Region {
  return createRandomRegion(undefined, undefined, 'opt-in-not-required');
}

export function createRandomOptedInRegions(
  count = faker.datatype.number({ max: 20, min: 2 })
): Region[] {
  const regions: Region[] = [];
  for (let i = 0; i < count; i++) {
    regions.push(createRandomOptedInRegion());
  }

  return regions;
}

export function createRandomOptInNotRequiredRegions(
  count = faker.datatype.number({ max: 20, min: 2 })
): Region[] {
  const regions: Region[] = [];
  for (let i = 0; i < count; i++) {
    regions.push(createRandomOptInNotRequiredRegion());
  }

  return regions;
}

export function createRandomMixedOptInRegions(): Region[] {
  return [
    ...createRandomRegions(),
    ...createRandomOptedInRegions(),
    ...createRandomOptInNotRequiredRegions(),
  ];
}

interface CreateMixedRegionsReturn {
  random: Region[];
  optedIn: Region[];
  optInNotRequired: Region[];
  regions: Region[];
}

export function createMixedRegions(): CreateMixedRegionsReturn {
  const regions = createRandomMixedOptInRegions();

  const optedIn = regions.filter(region => region.OptInStatus === 'opted-in');

  const optInNotRequired = regions.filter(
    region => region.OptInStatus === 'opt-in-not-required'
  );

  /** if it's not either of these, it's a random word, so filter them out */
  const random = regions.filter(
    region =>
      region.OptInStatus !== 'opted-in' &&
      region.OptInStatus !== 'opt-in-not-required'
  );

  return {
    optedIn,
    optInNotRequired,
    random,
    regions,
  };
}
