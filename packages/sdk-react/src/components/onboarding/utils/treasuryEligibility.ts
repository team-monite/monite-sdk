import { components } from '@/api';

type EntityResponse = components['schemas']['EntityResponse'];
type PaymentMethod = components['schemas']['PaymentMethod'];

/**
 * Checks if an entity is eligible for Stripe Treasury onboarding.
 * 
 * Treasury eligibility criteria:
 * 1. Entity must be based in the United States
 * 2. Entity must have us_ach payment method with 'send' direction assigned
 * 
 * When eligible, the onboarding flow will:
 * - Show Treasury-specific terms and conditions
 * - Use Stripe Financial Connections for bank verification
 * - Enable Treasury financial services upon completion
 * 
 * @param entity - The entity to check
 * @param paymentMethods - The payment methods assigned to the entity
 * @returns true if the entity meets all Treasury eligibility requirements
 */
export function isTreasuryEligible(
  entity: EntityResponse | undefined,
  paymentMethods: PaymentMethod[] | undefined
): boolean {
  if (!entity || !paymentMethods) {
    return false;
  }

  // Check criterion 1: Entity must be US-based
  const isUSEntity = entity.address?.country === 'US';
  if (!isUSEntity) {
    return false;
  }

  // Check criterion 2: Entity must have us_ach with send direction
  // Per documentation: Payment method must be 'active' for Treasury eligibility
  const hasUSACHSend = paymentMethods.some((method) =>
    method.type === 'us_ach' &&
    method.direction === 'send' &&
    method.status === 'active'
  );

  return hasUSACHSend;
}