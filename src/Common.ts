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

/** Interface used for all inventory generation classes */
export interface CommonClassArgs {
  /** aws role arn */
  assumeRoleArn?: AWSRoleArn;
  /** role external ID string */
  externalId?: AWSExternalId;
  /** aws credential profile name */
  profile?: AWSProfileName;
  /** AWS credential session name */
  sessionName?: AWSRoleSessionName;
  /** name given to an AWS resource used to perform a get request against to get its metadata */
  resources?: ResourceName[];
}

export interface RegionalCommonClassArgs extends CommonClassArgs {
  region: AWSRegionName;
}

/**
 * Attributes vary by resource type.  See the resource's <Type>InventoryItem
 * interface in the Osmium project for specific details.
 */
export interface CommonInventoryItem {
  attributes: {
    /** depends on the resource */
    [key: string]: unknown;
  };
  /** project specific URN identifying a resource */
  urn: ResourceUrn;
}
