import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

// TODO add default locale
const regionNames = new Intl.DisplayNames(['en'], {
  type: 'region',
});

export const getRegionName = (regionCode: AllowedCountries) =>
  regionNames.of(regionCode) ?? regionCode;

/**
 * This function generates a comma-separated string containing labels for the provided `OnboardingRelationship` object.
 *
 * @param relationship - The `OnboardingRelationship` object containing relationship flags.
 * @param i18n LinguiJS I18n instance
 * @returns A comma-separated string with labels corresponding to the specified relationships.
 *
 * @remarks
 * The generated string contains labels for each `true` property in the `OnboardingRelationship` object.
 *
 * @example
 * ```
 * const relationshipLabels = relationshipToLabel({ representative: true, owner: true, director: false, executive: false });
 * // Output: "Account representative, Owner"
 * ```
 */
export const relationshipToLabel = (
  relationship: OnboardingPersonRelationship,
  i18n: I18n
): string => {
  const list: string[] = [];

  if (relationship.representative) {
    list.push(t(i18n)`Account representative`);
  }

  if (relationship.owner) {
    list.push(t(i18n)`Owner`);
  }

  if (relationship.director) {
    list.push(t(i18n)`Director`);
  }

  if (relationship.executive) {
    list.push(t(i18n)`Executive`);
  }

  return list.join(', ');
};

type AllowedCountries = components['schemas']['AllowedCountries'];
type OnboardingPersonRelationship =
  components['schemas']['OnboardingPersonRelationship'];
