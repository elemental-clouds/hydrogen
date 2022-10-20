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

/**
 * The attributes value depends on the resource type.  See the resource's <i><b>*InventoryItem</b></i>
 * interface for specific details.  </br></br>Note the resource's interface is defined directly by the cloud provider.
 */
export interface CommonInventoryItem {
  /** values for attributes depends on the resource type and are set by the cloud provider */
  attributes: {
    [key: string]: unknown;
  };
  /** project specific URN identifying a resource */
  urn: ResourceUrn;
}
