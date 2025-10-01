import { components } from '@/api';
import { useLingui } from '@lingui/react';

/**
 * Get a display-friendly name for an entity (organization or individual)
 * @param entity - The entity object
 * @param i18n - Lingui i18n instance for localization
 * @returns Display name or fallback "Account Holder" text
 */
export function getEntityDisplayName(
  entity: components['schemas']['EntityResponse'] | undefined,
  i18n: ReturnType<typeof useLingui>['i18n']
): string {
  if (!entity) return i18n._(`Account Holder`);

  if ('organization' in entity && entity.organization) {
    return entity.organization.legal_name || i18n._(`Account Holder`);
  }

  if ('individual' in entity && entity.individual) {
    const firstName = entity.individual.first_name || '';
    const lastName = entity.individual.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || i18n._(`Account Holder`);
  }

  return i18n._(`Account Holder`);
}

/**
 * Get the account holder type from entity
 * @param entity - The entity object
 * @returns 'individual' or 'company'
 */
export function getAccountHolderType(
  entity: components['schemas']['EntityResponse'] | undefined
): 'individual' | 'company' {
  return entity?.type === 'individual' ? 'individual' : 'company';
}
