import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';
import {
  OnboardingStripeBankAccount,
  OnboardingStripeBankAccountRef,
} from '../OnboardingStripeBankAccount';
import { useTreasuryEligibility } from '../hooks';
import { components } from '@/api';
import { getCountriesArray, countryCurrencyList } from '@/core/utils/countries';
import { MoniteCountry } from '@/ui/Country';
import { MoniteCurrency } from '@/ui/Currency';
import { Button } from '@/ui/components/button';
import { Card } from '@/ui/components/card';
import { Input } from '@/ui/components/input';
import { Label } from '@/ui/components/label';
import { Table, TableBody, TableCell, TableRow } from '@/ui/components/table';
import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { ArrowLeft, X } from 'lucide-react';
import { useState, useCallback, useMemo, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';

interface BankAccountData {
  country: string;
  accountHolderName: string;
  currency: string;
  accountNumber: string;
  routingNumber: string;
}

interface OnboardingBankAccountFlowProps {
  allowedCurrencies?: components['schemas']['CurrencyEnum'][];
  allowedCountries?: components['schemas']['AllowedCountries'][];
}

type Step = 'initial' | 'form' | 'verification' | 'stripe';

export const OnboardingBankAccountFlow = ({
  allowedCurrencies: _allowedCurrencies,
  allowedCountries,
}: OnboardingBankAccountFlowProps) => {
  const { i18n } = useLingui();
  const { isEligible: isTreasuryEligible } = useTreasuryEligibility();
  const stripeBankAccountRef = useRef<OnboardingStripeBankAccountRef>(null);

  const [currentStep, setCurrentStep] = useState<Step>('initial');

  const {
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
  } = useForm<BankAccountData>({
    defaultValues: {
      country: '',
      accountHolderName: '',
      currency: '',
      accountNumber: '',
      routingNumber: '',
    },
    mode: 'onChange',
  });

  const watchedCountry = watch('country');
  const watchedCurrency = watch('currency');
  const watchedAccountHolderName = watch('accountHolderName');
  const watchedAccountNumber = watch('accountNumber');
  const watchedRoutingNumber = watch('routingNumber');

  const availableCountries = useMemo(() => {
    const allCountries = getCountriesArray(i18n);

    if (allowedCountries) {
      return allCountries.filter((country) =>
        allowedCountries.includes(
          country.code as components['schemas']['AllowedCountries']
        )
      );
    }

    return allCountries;
  }, [i18n, allowedCountries]);

  const handleCountrySelect = useCallback(
    (country: string) => {
      const currencyMapping = countryCurrencyList.find(
        (c) => c.country === country
      );

      setValue('country', country);
      setValue('currency', currencyMapping?.currency || '');
      setCurrentStep('form');
    },
    [setValue]
  );

  const onFormSubmit = useCallback(() => {
    setCurrentStep('verification');
  }, []);

  const handleEdit = useCallback(() => {
    setCurrentStep('form');
  }, []);

  // Stripe component is always rendered but hidden - controlled by ref call
  // This allows the "Verify account" button to trigger the flow without changing steps

  if (currentStep === 'initial') {
    // If Treasury-eligible, skip manual form and present verification UI directly
    if (isTreasuryEligible) {
      return (
        <OnboardingForm actions={null} onSubmit={(e) => e.preventDefault()}>
          <OnboardingStepContent>
            <div
              style={{
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                visibility: 'hidden',
              }}
            >
              <OnboardingStripeBankAccount
                ref={stripeBankAccountRef}
                withFormWrapper={false}
              />
            </div>
            <Card className="mtw:p-6 mtw:border mtw:border-gray-200 mtw:rounded-[14px] mtw:bg-white mtw:shadow-sm mtw:w-[520px] mtw:max-w-full">
              <h3 className="mtw:mb-2 mtw:font-semibold mtw:text-lg">
                <Trans>Bank account</Trans>
              </h3>
              <p className="mtw:text-sm mtw:text-muted-foreground mtw:mb-3">
                <Trans>
                  For US Treasury-enabled entities, verify your bank using
                  Stripe Financial Connections. No manual bank details are
                  required.
                </Trans>
              </p>
              <Button
                onClick={() =>
                  stripeBankAccountRef.current?.startVerification()
                }
                className="mtw:min-w-[160px]"
              >
                <Trans>Verify account</Trans>
              </Button>
            </Card>
          </OnboardingStepContent>
        </OnboardingForm>
      );
    }
    return (
      <OnboardingForm actions={null} onSubmit={(e) => e.preventDefault()}>
        <div
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            visibility: 'hidden',
          }}
        >
          {isTreasuryEligible && (
            <OnboardingStripeBankAccount
              ref={stripeBankAccountRef}
              withFormWrapper={false}
            />
          )}
        </div>

        <OnboardingStepContent>
          <div className="mtw:text-center mtw:mb-4">
            <p className="mtw:text-sm mtw:text-muted-foreground mtw:mb-4">
              <Trans>
                Add a bank to make transfers of funds from your bank account to
                Stripe account and to vendors.
              </Trans>
            </p>
          </div>

          <Card className="mtw:p-6 mtw:border mtw:border-gray-200 mtw:rounded-[14px] mtw:bg-white mtw:shadow-sm mtw:w-[520px] mtw:max-w-full">
            <Label className="mtw:mb-2 mtw:font-medium mtw:text-sm mtw:text-foreground">
              <Trans>Country of the bank account</Trans>
            </Label>

            <MoniteCountry
              name="country"
              control={control}
              allowedCountries={allowedCountries}
              showFlag={true}
              fullWidth
              onChange={(_event, value) => {
                if (
                  value &&
                  !Array.isArray(value) &&
                  typeof value !== 'string'
                ) {
                  handleCountrySelect(value.code);
                }
              }}
            />

            <p className="mtw:text-sm mtw:text-gray-600 mtw:mt-3">
              <Trans>
                I, the account holder, am the only person required to authorise
                debits. By submitting a bank account, I authorise Monite to
                transfer to and from this bank account through the Single Euro
                Payments Area (SEPA) debit system and confirm that I have read
                and agree to the{' '}
              </Trans>
              <span className="mtw:text-blue-600 mtw:cursor-pointer mtw:font-medium">
                <Trans>Service Agreement</Trans>
              </span>
              <Trans>, including, the SEPA Direct Debit Mandate.</Trans>
            </p>

            <div className="mtw:flex mtw:justify-end mtw:mt-4 mtw:gap-2 mtw:pt-3 mtw:border-t mtw:border-gray-300">
              <Button
                variant="ghost"
                className="mtw:h-12 mtw:px-2 mtw:text-base mtw:font-medium mtw:text-gray-600"
              >
                <X className="mtw:mr-2 mtw:h-4 mtw:w-4" />
                <Trans>Close</Trans>
              </Button>
              <Button
                disabled={!watchedCountry}
                onClick={() => setCurrentStep('form')}
                className="mtw:min-w-[140px] mtw:h-12 mtw:px-4 mtw:text-base mtw:font-medium"
              >
                <Trans>Add account</Trans>
              </Button>
            </div>
          </Card>
        </OnboardingStepContent>
      </OnboardingForm>
    );
  }

  if (currentStep === 'form') {
    const selectedCountry = availableCountries.find(
      (c) => c.code === watchedCountry
    );

    return (
      <OnboardingForm actions={null} onSubmit={handleFormSubmit(onFormSubmit)}>
        <div
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            visibility: 'hidden',
          }}
        >
          {isTreasuryEligible && (
            <OnboardingStripeBankAccount ref={stripeBankAccountRef} />
          )}
        </div>

        <OnboardingStepContent>
          <div className="mtw:text-center mtw:mb-4">
            <p className="mtw:text-sm mtw:text-muted-foreground mtw:mb-4">
              <Trans>
                Add a bank to make transfers of funds from your bank account to
                Stripe account and to vendors.
              </Trans>
            </p>
          </div>

          <Card className="mtw:p-6 mtw:border mtw:border-gray-300 mtw:rounded-lg">
            <div className="mtw:mb-3">
              <Label className="mtw:mb-1 mtw:font-medium mtw:text-sm mtw:text-foreground">
                <Trans>Country of the bank account</Trans>
              </Label>
              <Input
                value={selectedCountry?.label || ''}
                readOnly
                className="mtw:h-12 mtw:text-base mtw:bg-gray-100 mtw:rounded-lg mtw:border-gray-200"
              />
            </div>

            <div className="mtw:mb-3">
              <Label className="mtw:mb-1 mtw:font-medium mtw:text-sm mtw:text-foreground">
                <Trans>Account holder name</Trans>
              </Label>

              <Controller
                name="accountHolderName"
                control={control}
                rules={{ required: t(i18n)`Account holder name is required` }}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      {...field}
                      className="mtw:h-12 mtw:text-base mtw:bg-white mtw:rounded-lg"
                      aria-invalid={!!fieldState.error}
                    />
                    {fieldState.error && (
                      <p className="mtw:text-sm mtw:text-destructive mtw:mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="mtw:mb-3">
              <Label className="mtw:mb-1 mtw:font-medium mtw:text-sm mtw:text-foreground">
                <Trans>Currency</Trans>
              </Label>
              <MoniteCurrency name="currency" control={control} fullWidth />
            </div>

            <div className="mtw:mb-3">
              <Label className="mtw:mb-1 mtw:font-medium mtw:text-sm mtw:text-foreground">
                <Trans>Account number</Trans>
              </Label>

              <Controller
                name="accountNumber"
                control={control}
                rules={{ required: t(i18n)`Account number is required` }}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      {...field}
                      className="mtw:h-12 mtw:text-base mtw:bg-white mtw:rounded-lg"
                      aria-invalid={!!fieldState.error}
                    />
                    {fieldState.error && (
                      <p className="mtw:text-sm mtw:text-destructive mtw:mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="mtw:mb-3">
              <Label className="mtw:mb-1 mtw:font-medium mtw:text-sm mtw:text-foreground">
                <Trans>Routing number</Trans>
              </Label>
              <Controller
                name="routingNumber"
                control={control}
                rules={{ required: t(i18n)`Routing number is required` }}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      {...field}
                      className="mtw:h-12 mtw:text-base mtw:bg-white mtw:rounded-lg"
                      aria-invalid={!!fieldState.error}
                    />
                    {fieldState.error && (
                      <p className="mtw:text-sm mtw:text-destructive mtw:mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="mtw:flex mtw:justify-between mtw:mt-3 mtw:pt-2 mtw:border-t mtw:border-gray-300">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep('initial')}
                className="mtw:h-12 mtw:text-base mtw:font-medium mtw:text-gray-600"
              >
                <ArrowLeft className="mtw:mr-2 mtw:h-4 mtw:w-4" />
                <Trans>Back</Trans>
              </Button>
              <Button
                type="submit"
                className="mtw:min-w-[140px] mtw:h-12 mtw:px-4 mtw:text-base mtw:font-medium"
              >
                <Trans>Add account</Trans>
              </Button>
            </div>
          </Card>
        </OnboardingStepContent>
      </OnboardingForm>
    );
  }

  if (currentStep === 'verification') {
    const selectedCountry = availableCountries.find(
      (c) => c.code === watchedCountry
    );

    return (
      <OnboardingForm actions={null} onSubmit={(e) => e.preventDefault()}>
        <div
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            visibility: 'hidden',
          }}
        >
          {isTreasuryEligible && (
            <OnboardingStripeBankAccount ref={stripeBankAccountRef} />
          )}
        </div>

        <OnboardingStepContent>
          <Card className="mtw:p-6 mtw:border mtw:border-gray-200 mtw:rounded-[14px] mtw:bg-white mtw:shadow-sm mtw:w-[520px] mtw:max-w-full">
            <div className="mtw:flex mtw:justify-between mtw:items-center mtw:mb-3">
              <h3 className="mtw:font-semibold mtw:text-lg mtw:text-foreground">
                <Trans>Default account</Trans>
              </h3>
              <Button
                variant="ghost"
                onClick={handleEdit}
                className="mtw:text-sm mtw:text-blue-600 mtw:p-0 mtw:h-auto hover:mtw:bg-transparent"
              >
                <Trans>Edit</Trans>
              </Button>
            </div>

            {/* Table layout for bank account details */}
            <Table className="mtw:mb-3">
              <TableBody>
                <TableRow>
                  <TableCell className="mtw:text-gray-600 mtw:text-sm mtw:border-b mtw:border-gray-200 mtw:pl-0 mtw:w-[40%]">
                    <Trans>Country</Trans>
                  </TableCell>
                  <TableCell className="mtw:text-foreground mtw:text-sm mtw:font-medium mtw:border-b mtw:border-gray-200 mtw:pr-0">
                    {selectedCountry?.label}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="mtw:text-gray-600 mtw:text-sm mtw:border-b mtw:border-gray-200 mtw:pl-0">
                    <Trans>Account holder</Trans>
                  </TableCell>
                  <TableCell className="mtw:text-foreground mtw:text-sm mtw:font-medium mtw:border-b mtw:border-gray-200 mtw:pr-0">
                    {watchedAccountHolderName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="mtw:text-gray-600 mtw:text-sm mtw:border-b mtw:border-gray-200 mtw:pl-0">
                    <Trans>Currency</Trans>
                  </TableCell>
                  <TableCell className="mtw:text-foreground mtw:text-sm mtw:font-medium mtw:border-b mtw:border-gray-200 mtw:pr-0">
                    {watchedCurrency}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="mtw:text-gray-600 mtw:text-sm mtw:border-b mtw:border-gray-200 mtw:pl-0">
                    <Trans>Account number</Trans>
                  </TableCell>
                  <TableCell className="mtw:text-foreground mtw:text-sm mtw:font-medium mtw:border-b mtw:border-gray-200 mtw:pr-0">
                    {watchedAccountNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="mtw:text-gray-600 mtw:text-sm mtw:border-none mtw:pl-0">
                    <Trans>Routing number</Trans>
                  </TableCell>
                  <TableCell className="mtw:text-foreground mtw:text-sm mtw:font-medium mtw:border-none mtw:pr-0">
                    {watchedRoutingNumber}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {watchedCountry === 'US' && isTreasuryEligible && (
              <div className="mtw:mb-3">
                <Button
                  type="button"
                  variant="outline"
                  className="mtw:h-10 mtw:px-4 mtw:bg-muted mtw:text-foreground hover:mtw:bg-muted/80"
                  onClick={() => {
                    stripeBankAccountRef.current?.startVerification();
                  }}
                >
                  <Trans>Verify account</Trans>
                </Button>
              </div>
            )}

            <div className="mtw:flex mtw:justify-between mtw:items-center mtw:pt-3 mtw:border-t mtw:border-gray-200">
              {/* Empty space on the left */}
              <div />

              <div className="mtw:flex mtw:gap-2 mtw:items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mtw:h-10 mtw:w-10 mtw:rounded-lg mtw:bg-muted/60 mtw:text-muted-foreground hover:mtw:bg-muted"
                  onClick={() => setCurrentStep('initial')}
                >
                  <X className="mtw:h-4 mtw:w-4" />
                  <span className="mtw:sr-only">
                    <Trans>Close</Trans>
                  </span>
                </Button>

                <Button type="submit" className="mtw:h-10 mtw:px-6">
                  <Trans>Continue</Trans>
                </Button>
              </div>
            </div>
          </Card>
        </OnboardingStepContent>
      </OnboardingForm>
    );
  }

  // This should never be reached - all steps are handled above
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          visibility: 'hidden',
        }}
      >
        {isTreasuryEligible && (
          <OnboardingStripeBankAccount ref={stripeBankAccountRef} />
        )}
      </div>

      {/* Fallback render - shouldn't be reached */}
      <Trans>Unknown step: {currentStep}</Trans>
    </>
  );
};
