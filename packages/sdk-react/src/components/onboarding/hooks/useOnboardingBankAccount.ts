import { useCallback, useEffect, useMemo, useState } from 'react';

import { ErrorType } from '@/core/queries/types';
import {
  useCreateBankAccount,
  useDeleteBankAccount,
} from '@/core/queries/useBankAccounts';
import {
  useOnboardingBankAccountMask,
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
  useOnboardingCurrencyToCountries,
} from '@/core/queries/useOnboarding';
import {
  AllowedCountries,
  CreateEntityBankAccountRequest,
  CurrencyEnum,
  EntityBankAccountResponse,
  OnboardingBankAccount,
  OnboardingBankAccountMask,
  OnboardingRequirement,
} from '@monite/sdk-api';

import { enrichFieldsByValues, generateFieldsByMask } from '../transformers';
import type { OnboardingFormType } from './useOnboardingForm';
import { useOnboardingForm } from './useOnboardingForm';

export type OnboardingBankAccountReturnType = {
  /**  isLoading a boolean flag indicating whether the form data is being loaded. */
  isLoading: boolean;

  error: ErrorType;

  currencies: CurrencyEnum[];

  /**
   * Countries available to select based on picked currency
   */
  countries: AllowedCountries[];

  primaryAction: (
    payload: CreateEntityBankAccountRequest
  ) => Promise<EntityBankAccountResponse>;

  onboardingForm: OnboardingFormType<
    CreateEntityBankAccountRequest,
    EntityBankAccountResponse
  >;
};

export function useOnboardingBankAccount(): OnboardingBankAccountReturnType {
  const { data: onboarding, isLoading: isOnboardingDataLoading } =
    useOnboardingRequirementsData();

  const patchOnboardingRequirements = usePatchOnboardingRequirementsData();

  const {
    mutateAsync: createBankAccountMutation,
    isLoading: isCreateBankAccountLoading,
  } = useCreateBankAccount();

  const {
    mutateAsync: deleteBankAccountMutation,
    isLoading: isDeleteBankAccountLoading,
  } = useDeleteBankAccount();

  const {
    data: bankAccountMasks,
    error: bankAccountMasksError,
    isLoading: isBankAccountMaskLoading,
  } = useOnboardingBankAccountMask();

  const { data: currencyToCountries, isLoading: isCurrencyToCountriesLoading } =
    useOnboardingCurrencyToCountries();

  const bankAccounts = useMemo(
    () => onboarding?.data?.bank_accounts || [],
    [onboarding?.data?.bank_accounts]
  );

  const currencies = useMemo(
    () =>
      bankAccountMasks ? (Object.keys(bankAccountMasks) as CurrencyEnum[]) : [],
    [bankAccountMasks]
  );

  const currentBankAccount = useMemo(() => {
    if (!bankAccounts?.length) return null;
    return bankAccounts[0];
  }, [bankAccounts]);

  const [mask, setMask] = useState<OnboardingBankAccountMask | null>(null);

  const [countries, setCountries] = useState<AllowedCountries[]>([]);

  const [fields, setFields] = useState<OnboardingBankAccount>(
    useMemo(() => {
      if (currentBankAccount) {
        return currentBankAccount;
      }

      return generateFieldsByMask<OnboardingBankAccount>(getDefaultMask());
    }, [currentBankAccount])
  );

  const onboardingForm = useOnboardingForm<
    CreateEntityBankAccountRequest,
    EntityBankAccountResponse | undefined
  >(fields, 'bankAccount');

  const { watch } = onboardingForm.methods;

  const currency = watch('currency');

  useEffect(() => {
    if (!currency) return;
    if (!bankAccountMasks) return;
    if (!(currency in bankAccountMasks)) return;

    const mask = bankAccountMasks[currency];
    const countries = currencyToCountries?.[currency];

    if (countries) setCountries(countries);
    if (mask) setMask(mask);
  }, [bankAccountMasks, currency, currencyToCountries]);

  useEffect(() => {
    if (!mask) return;

    setFields(generateFieldsByMask<OnboardingBankAccount>(mask));
  }, [mask]);

  const primaryAction = useCallback(
    async (payload: CreateEntityBankAccountRequest) => {
      const response = await createBankAccountMutation({
        ...payload,
        is_default_for_currency: true,
      });

      if (currentBankAccount) {
        await deleteBankAccountMutation(currentBankAccount.id);
      }

      patchOnboardingRequirements({
        requirements: [OnboardingRequirement.BANK_ACCOUNTS],
        data: {
          bank_accounts: [enrichFieldsByValues(fields, payload)],
        },
      });

      return response;
    },
    [
      createBankAccountMutation,
      deleteBankAccountMutation,
      currentBankAccount,
      patchOnboardingRequirements,
      fields,
    ]
  );

  return {
    isLoading:
      isBankAccountMaskLoading ||
      isOnboardingDataLoading ||
      isCreateBankAccountLoading ||
      isDeleteBankAccountLoading ||
      isCurrencyToCountriesLoading,
    currencies,
    countries,
    onboardingForm,
    primaryAction,
    error: bankAccountMasksError,
  };
}

const getDefaultMask = (): OnboardingBankAccountMask => ({
  country: true,
  currency: true,
});
