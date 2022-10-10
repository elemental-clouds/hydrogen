/** aws credential profile name */
export type AWSProfileName = string;

/** aws role arn */
export type AWSRoleArn = string;

/** AWS credential session name */
export type AWSRoleSessionName = string;

/** role external ID string */
export type AWSExternalId = string;

/** AWS region name, example: us-east-1 */
export type AWSRegionName = string;

/** System version number used to ensure data schemas */
export type SystemVersionNumber = string;

/** AWS service name used in resource URN */
export type SystemServiceName = string;

/** AWS Account ID number as a string */
export type AwsAccountId = string;

/** project specific URN identifying a resource */
export type ResourceUrn = string;

/** name given to an AWS resource used to perform a get request against to get its metadata */
export type ResourceName = string;

/** Common Class interface */
export interface CommonClassArgs {
  assumeRoleArn?: AWSRoleArn;
  externalId?: AWSExternalId;
  profile?: AWSProfileName;
  sessionName?: AWSRoleSessionName;
  resources?: ResourceName[];
}

export interface RegionalCommonClassArgs extends CommonClassArgs {
  region: AWSRegionName;
}

export interface CommonInventoryItem {
  attributes: {
    [key: string]: unknown;
  };
  urn: ResourceUrn;
}
