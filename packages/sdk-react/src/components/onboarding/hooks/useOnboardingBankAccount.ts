import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  useOnboardingBankAccountMask,
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
  useOnboardingCurrencyToCountries,
} from '@/core/queries/useOnboarding';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { useLingui } from '@lingui/react';

import { enrichFieldsByValues, generateFieldsByMask } from '../transformers';
import type { OnboardingFormType } from './useOnboardingForm';
import { useOnboardingForm } from './useOnboardingForm';

export type OnboardingBankAccountReturnType = {
  isPending: boolean;

  /**  isLoading a boolean flag indicating whether the form data is being loaded. */
  isLoading: boolean;

  error:
    | Error
    | components['schemas']['HTTPValidationError']
    | components['schemas']['ErrorSchemaResponse']
    | null;

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

  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();
  const {
    mutateAsync: createBankAccountMutation,
    isPending: isCreateBankAccountPending,
  } = api.bankAccounts.postBankAccounts.useMutation(undefined, {
    onError: (error) => {
      toast.error(getAPIErrorMessage(i18n, error));
    },
  });

  const {
    mutateAsync: deleteBankAccountMutation,
    isPending: isDeleteBankAccountPending,
  } = api.bankAccounts.deleteBankAccountsId.useMutation(undefined, {
    onSuccess: async (_, variables) => {
      await Promise.all([
        api.bankAccounts.getBankAccounts.invalidateQueries(queryClient),
        api.bankAccounts.getBankAccountsId.invalidateQueries(
          {
            parameters: {
              path: { bank_account_id: variables.path.bank_account_id },
            },
          },
          queryClient
        ),
      ]);
    },
  });

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
        body: {
          ...payload,
          is_default_for_currency: true,
        },
      });

      if (currentBankAccount) {
        await deleteBankAccountMutation({
          body: undefined,
          path: {
            bank_account_id: currentBankAccount.id,
          },
        });
      }

      patchOnboardingRequirements({
        requirements: ['bank_accounts'],
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
    isPending: isCreateBankAccountPending || isDeleteBankAccountPending,
    isLoading:
      isOnboardingDataLoading ||
      isBankAccountMaskLoading ||
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

type AllowedCountries = components['schemas']['AllowedCountries'];
type CreateEntityBankAccountRequest =
  components['schemas']['CreateEntityBankAccountRequest'];
type CurrencyEnum = components['schemas']['CurrencyEnum'];
type EntityBankAccountResponse =
  components['schemas']['EntityBankAccountResponse'];
type OnboardingBankAccount = components['schemas']['OnboardingBankAccount'];
type OnboardingBankAccountMask =
  components['schemas']['OnboardingBankAccountMask'];
type OnboardingRequirement = components['schemas']['OnboardingRequirement'];
