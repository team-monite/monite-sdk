import { FILTER_TYPE_CREATED_AT } from '../payables/PayablesTable/consts';
import { FILTER_TYPE_SEARCH } from '../receivables/consts';
import { FILTER_TYPE_CREATED_BY } from './consts';

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

export type FilterTypes = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_CREATED_AT]?: Date | null;
  [FILTER_TYPE_CREATED_BY]?: string | null;
};

export type FilterValue = Date | string | null;
