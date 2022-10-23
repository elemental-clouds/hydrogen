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

/** control matching condition action */
export type Action =
  | '$includes'
  | '$excludes'
  | '$if_includes'
  | '$if_excludes';

/** condition the Action is looking to match */
export type Control = { [key in Action]?: ControlMap[] };

/** Resource configuration map, similar to CommonInventory Item but without the URNWWWW */
export type ControlMap = { attributes: { [key: string]: unknown } };

/** an array of conditions to validate a resource against */
export type ControlProcedure = Control[];

/** the compliance state of a resource against a specific control */
export type ComplianceState =
  | 'COMPLIANT'
  | 'NON_COMPLIANT'
  | 'SKIPPED'
  | 'UNKNOWN';

/**
 * Titanium engine input arguments, procedure is an array of controls
 * and item is the resource to compare the controls against.
 */
export interface EngineConstructor {
  procedure: ControlProcedure;
  item: CommonInventoryItem;
}

/**
 * The individual result of comparing a resource against a specific control
 */
export interface ControlValidation {
  action: Action;
  map: ControlMap;
  result: ComplianceState;
}

/**
 * The final result of comparing a resource against a set of control conditions
 */
export interface FinalControlValidationResult {
  compliant: ControlValidation[];
  controlProcedure: ControlProcedure;
  item: CommonInventoryItem;
  nonCompliant: ControlValidation[];
  result: ComplianceState;
  skipped: ControlValidation[];
}
