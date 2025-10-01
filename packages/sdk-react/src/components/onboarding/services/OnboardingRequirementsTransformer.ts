import { components } from '@/api';
import type { OnboardingRequirementExtended } from '../types';

export type OnboardingRequirementError = Pick<
  components['schemas']['OnboardingRequirementsError'],
  'requirement' | 'reason'
>;

export interface OnboardingFieldData {
  error: { message: string } | null;
  required: boolean;
  value: string | null;
}

export interface OnboardingDataFields {
  entity?: Record<string, OnboardingFieldData>;
  business_profile?: Record<string, OnboardingFieldData>;
  tos_acceptance?: Record<string, OnboardingFieldData>;
  treasury_tos_acceptance?: Record<string, OnboardingFieldData>;
}

function createFieldData(error?: OnboardingRequirementError, value?: string): OnboardingFieldData {
  return {
    error: error ? { message: error.reason } : null,
    required: true,
    value: value || null,
  };
}

export function processTreasuryRequirements(
  requirements: string[], 
  errors: OnboardingRequirementError[]
): Record<string, OnboardingFieldData> {
  const treasuryFields: Record<string, OnboardingFieldData> = {};

  requirements.forEach((requirement: string) => {
    if (requirement.includes('treasury_tos_acceptance.date')) {
      const error = errors.find(err => err.requirement === requirement);
      treasuryFields.date = createFieldData(error);
    }
  });

  return treasuryFields;
}

export function processEntityRequirements(
  requirements: string[], 
  errors: OnboardingRequirementError[]
): Record<string, OnboardingFieldData> {
  const entityFields: Record<string, OnboardingFieldData> = {};

  requirements.forEach((requirement: string) => {
    if (requirement.startsWith('entities.tax_id')) {
      const error = errors.find(err => err.requirement === requirement);
      entityFields.tax_id = createFieldData(error);
    }
  });

  return entityFields;
}

export function processBusinessProfileRequirements(
  requirements: string[], 
  errors: OnboardingRequirementError[]
): Record<string, OnboardingFieldData> {
  const businessProfileFields: Record<string, OnboardingFieldData> = {};
  const supportedFields = ['url', 'mcc', 'description_of_goods_or_services'];

  requirements.forEach((requirement: string) => {
    if (!requirement.includes('business_profile')) return;

    const error = errors.find(err => err.requirement === requirement);
    const dotIndex = requirement.lastIndexOf('.');
    if (dotIndex !== -1) {
      const fieldName = requirement.slice(dotIndex + 1);

      if (supportedFields.includes(fieldName)) {
        businessProfileFields[fieldName] = createFieldData(error);
      }
    } else {
      businessProfileFields.url = createFieldData(error);
      businessProfileFields.mcc = createFieldData(error);
    }
  });

  return businessProfileFields;
}

/**
 * Process TOS acceptance requirements and create TOS field data
 */
export function processTosRequirements(
  requirements: string[], 
  errors: OnboardingRequirementError[]
): Record<string, OnboardingFieldData> {
  const tosFields: Record<string, OnboardingFieldData> = {};

  requirements.forEach((requirement: string) => {
    if (requirement.includes('tos_acceptance') && !requirement.includes('treasury') && requirement.includes('.date')) {
      const error = errors.find(err => err.requirement === requirement);
      tosFields.date = createFieldData(error);
    }
  });

  return tosFields;
}

/**
 * Map requirements to standard requirement names
 */
export function mapToStandardRequirements(
  requirements: string[],
  hasTreasury: boolean
): OnboardingRequirementExtended[] {
  const standardRequirements: OnboardingRequirementExtended[] = [];

  requirements.forEach((requirement) => {
    if (requirement.startsWith('entities.tax_id')) {
      if (!standardRequirements.includes('entity')) {
        standardRequirements.push('entity');
      }
    } else if (requirement.includes('business_profile')) {
      if (!standardRequirements.includes('business_profile')) {
        standardRequirements.push('business_profile');
      }
    } else if (requirement.includes('tos_acceptance') && !requirement.includes('treasury')) {
      if (!standardRequirements.includes('tos_acceptance')) {
        standardRequirements.push('tos_acceptance');
      }
    } else if (
      requirement === 'bank_account' ||
      requirement.includes('bank_accounts') ||
      requirement.includes('bank_account.')
    ) {
      if (!standardRequirements.includes('bank_accounts')) {
        standardRequirements.push('bank_accounts');
      }
    } else if (requirement.includes('persons.')) {
      if (!standardRequirements.includes('persons')) {
        standardRequirements.push('persons');
      }
      if (requirement.includes('documents') && !standardRequirements.includes('persons_documents')) {
        standardRequirements.push('persons_documents');
      }
    }
  });

  if (
    hasTreasury &&
    requirements.some((requirement) =>
      requirement.includes('treasury_tos_acceptance')
    ) &&
    !standardRequirements.includes('treasury_tos_acceptance')
  ) {
    standardRequirements.push('treasury_tos_acceptance');
  }

  if (
    hasTreasury &&
    !standardRequirements.includes('bank_accounts') &&
    requirements.some((requirement) =>
      requirement === 'bank_accounts' || requirement.includes('bank_account')
    )
  ) {
    standardRequirements.push('bank_accounts');
  }

  return standardRequirements;
}

/**
 * Build the final onboarding data fields object
 */
export function buildOnboardingDataFields(
  entityFields: Record<string, OnboardingFieldData>,
  businessProfileFields: Record<string, OnboardingFieldData>,
  tosFields: Record<string, OnboardingFieldData>,
  treasuryFields: Record<string, OnboardingFieldData>
): OnboardingDataFields {
  const dataFields: OnboardingDataFields = {};

  if (Object.keys(entityFields).length > 0) {
    dataFields.entity = entityFields;
  }
  if (Object.keys(businessProfileFields).length > 0) {
    dataFields.business_profile = businessProfileFields;
  }
  if (Object.keys(tosFields).length > 0) {
    dataFields.tos_acceptance = tosFields;
  }
  if (Object.keys(treasuryFields).length > 0) {
    dataFields.treasury_tos_acceptance = treasuryFields;
  }

  return dataFields;
}

/**
 * Main transformation function that orchestrates all the processing
 */
export function transformOnboardingRequirements(
  currentlyDue: string[],
  requirementsErrors: OnboardingRequirementError[]
): { requirements: OnboardingRequirementExtended[]; data: OnboardingDataFields } {
  const treasuryFields = processTreasuryRequirements(currentlyDue, requirementsErrors);
  const entityFields = processEntityRequirements(currentlyDue, requirementsErrors);
  const businessProfileFields = processBusinessProfileRequirements(currentlyDue, requirementsErrors);
  const tosFields = processTosRequirements(currentlyDue, requirementsErrors);

  const hasTreasury = Object.keys(treasuryFields).length > 0;

  const standardRequirements = mapToStandardRequirements(
    currentlyDue,
    hasTreasury
  );

  const dataFields = buildOnboardingDataFields(
    entityFields,
    businessProfileFields,
    tosFields,
    treasuryFields
  );

  return {
    requirements: standardRequirements,
    data: dataFields
  };
}
