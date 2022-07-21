export type Option = { label: string; value: string };

export type SelectOptions = Option[];

export interface NewPolicyFormFields {
  policyName: string;
  policyDescription?: string;
}

export interface NewConditionFormFields {
  conditionType: Option | null;
  selectedTags?: Option[];
}

export interface NewRuleFormFields {
  thresholdAmount: string;
  approvals: Option[][];
}
