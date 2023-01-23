import {
  EntityIndividualResponse,
  EntityOrganizationResponse,
  EntityResponse,
  BankAccount,
} from '@team-monite/sdk-api';
import { getIndividualName } from '../counterparts/helpers';

export function isIndividualEntity(
  entity: EntityResponse
): entity is EntityIndividualResponse {
  return entity.type === 'individual';
}

export function isOrganizationEntity(
  entity: EntityResponse
): entity is EntityOrganizationResponse {
  return entity.type === 'organization';
}

export function getEntityName(entity: EntityResponse): string {
  if (isIndividualEntity(entity)) {
    const {
      individual: { first_name, last_name },
    } = entity;

    return getIndividualName(first_name, last_name);
  }

  if (isOrganizationEntity(entity)) {
    const {
      organization: { legal_name },
    } = entity;

    return legal_name;
  }

  return '';
}

export function getDefaultBankAccount(
  bankAccountsList: BankAccount[]
): BankAccount | undefined {
  return bankAccountsList.find((bankAccount) => bankAccount?.is_default)
    ? bankAccountsList.find((bankAccount) => bankAccount?.is_default)
    : bankAccountsList[0];
}
