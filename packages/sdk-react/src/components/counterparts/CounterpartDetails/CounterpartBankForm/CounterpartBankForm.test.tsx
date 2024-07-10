import { components } from '@/api';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  counterpartBankFixture,
  counterpartBankListFixture,
  counterpartListFixture,
} from '@/mocks/counterparts';
import { individualId } from '@/mocks/counterparts/counterpart.mocks.types';
import {
  cachedMoniteSDK,
  renderWithClient,
  triggerChangeInput,
  triggerClickOnAutocompleteOption,
  triggerClickOnSelectOption,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import {
  AllowedCountries,
  CreateCounterpartBankAccount,
  CurrencyEnum,
  UpdateCounterpartBankAccount,
} from '@monite/sdk-api';
import { requestFn } from '@openapi-qraft/react';
import { waitFor, screen, fireEvent, act } from '@testing-library/react';

import { CounterpartBankForm } from './CounterpartBankForm';

describe('CounterpartBankForm', () => {
  test('should create a bank account', async () => {
    const onCreateMock = jest.fn();

    renderWithClient(
      <MoniteScopedProviders>
        <CounterpartBankForm
          counterpartId={individualId}
          onCreate={onCreateMock}
        />
      </MoniteScopedProviders>
    );

    const submitBtn = await screen.findByRole('button', {
      name: t`Add bank account`,
    });

    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    triggerChangeInput(/account name/i, '[create] Account name');
    triggerChangeInput(/iban/i, '[create] Iban');
    triggerChangeInput(/bic/i, '[create] Bic');
    triggerClickOnSelectOption(/country/i, 'Armenia');
    triggerClickOnAutocompleteOption(/currency/i, /Armenian/i);

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onCreateMock).toHaveBeenCalled();
    });
  }, 10_000);

  test('should show errors if non of the field is filled', async () => {
    renderWithClient(
      <MoniteScopedProviders>
        <CounterpartBankForm counterpartId={individualId} />
      </MoniteScopedProviders>
    );

    const submitBtn = await screen.findByRole('button', {
      name: t`Add bank account`,
    });

    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    fireEvent.click(submitBtn);

    const errors = await screen.findAllByText(/required field/i);

    expect(errors.length).toBeGreaterThanOrEqual(2);
  }, 10_000);

  test('should update a bank account', async () => {
    const onUpdateMock = jest.fn();

    const firstBankListFixture = counterpartBankListFixture[0];
    const counterpart = counterpartListFixture.find(
      (counterpart) => counterpart.id === firstBankListFixture.counterpart_id
    );

    if (!counterpart) {
      throw new Error(
        `Could not find counterpart by provided bank counterpart id: ${firstBankListFixture.counterpart_id}`
      );
    }

    renderWithClient(
      <MoniteScopedProviders>
        <CounterpartBankForm
          counterpartId={individualId}
          bankId={firstBankListFixture.id}
          onUpdate={onUpdateMock}
        />
      </MoniteScopedProviders>
    );

    const submitBtn = await screen.findByRole('button', {
      name: t`Update bank account`,
    });

    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onUpdateMock).toHaveBeenCalledWith(counterpartBankFixture.id);
    });
  }, 10_000);

  test('should catch onCancel callback', async () => {
    const onCancelMock = jest.fn();

    renderWithClient(
      <MoniteScopedProviders>
        <CounterpartBankForm
          counterpartId={individualId}
          onCancel={onCancelMock}
        />
      </MoniteScopedProviders>
    );

    const cancelBtn = await screen.findByRole('button', {
      name: t`Cancel`,
    });

    expect(cancelBtn).toBeInTheDocument();

    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(onCancelMock).toHaveBeenCalledTimes(1);
    });
  }, 10_000);

  describe('# Public API', () => {
    test('should send correct request when we are choose not UK and not US country', async () => {
      const getCreateSpy = jest.spyOn(
        cachedMoniteSDK.api.counterparts,
        'createBankAccount'
      );

      renderWithClient(
        <MoniteScopedProviders>
          <CounterpartBankForm counterpartId={individualId} />
        </MoniteScopedProviders>,
        cachedMoniteSDK
      );

      const accountName = '[create] Account name';
      const iban = '[create] Iban';
      const bic = '[create] Bic';
      const countrySelectName = /country/i;

      await waitFor(
        () =>
          expect(
            screen.findByRole('button', { name: countrySelectName })
          ).resolves.not.toBeDisabled(),
        { timeout: 5_000 }
      );

      triggerClickOnSelectOption(countrySelectName, /Armenia/i);
      triggerClickOnAutocompleteOption(/currency/i, /Armenian/i);
      triggerChangeInput(/account name/i, accountName);
      triggerChangeInput(/iban/i, iban);
      triggerChangeInput(/bic/i, bic);

      const submitBtn = screen.getByRole('button', {
        name: t`Add bank account`,
      });

      await act(() => fireEvent.click(submitBtn));

      /** Get all provided parameters into the last call */
      const lastCallArguments = getCreateSpy.mock.lastCall;
      expect(getCreateSpy.mock.lastCall).toBeDefined();

      const parameters = lastCallArguments![1];

      expect(parameters.name).toBe(accountName);
      expect(parameters.iban).toBe(iban);
      expect(parameters.bic).toBe(bic);
    }, 10_000);

    test('should send correct request when we choose any country', async () => {
      const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

      renderWithClient(
        <MoniteScopedProviders>
          <CounterpartBankForm counterpartId={individualId} />
        </MoniteScopedProviders>,
        cachedMoniteSDK
      );

      const accountName = '[create] Account name';
      const iban = '[create] Iban';
      const bic = '[create] Bic';
      const accountNumber = '[create] Account number';
      const sortCode = '[create] Sort code';
      const countrySelectName = /country/i;

      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: countrySelectName })
        ).not.toBeDisabled()
      );

      triggerClickOnSelectOption(countrySelectName, 'United Kingdom');
      triggerClickOnAutocompleteOption(/currency/i, /Armenian/i);

      fireEvent.change(screen.getByLabelText(/account name/i), {
        target: { value: accountName },
      });
      fireEvent.change(screen.getByLabelText(/iban/i), {
        target: { value: iban },
      });
      fireEvent.change(screen.getByLabelText(/bic/i), {
        target: { value: bic },
      });
      fireEvent.change(screen.getByLabelText(/account number/i), {
        target: { value: accountNumber },
      });
      fireEvent.change(screen.getByLabelText(/sort code/i), {
        target: { value: sortCode },
      });

      const submitBtn = screen.getByRole('button', {
        name: t`Add bank account`,
      });
      await act(async () => fireEvent.click(submitBtn));

      await waitFor(() => {
        expect(requestFnMock).toHaveBeenCalled();
      });

      const lastCallArguments = requestFnMock.mock.lastCall;

      const body = lastCallArguments?.[1]
        .body as components['schemas']['CreateCounterpartBankAccount'];

      await waitFor(() => {
        expect(body?.name).toBe(accountName);
        expect(body?.iban).toBe(iban);
        expect(body?.bic).toBe(bic);
        expect(body?.account_number).toBe(accountNumber);
        expect(body?.sort_code).toBe(sortCode);
      });
    }, 10_000);

    describe('# Backend Requests', () => {
      test('[CREATE] should send correct request (based on server model) when perform a POST request (trying to create a new entity)', async () => {
        const requestFnMock = requestFn as jest.MockedFunction<
          typeof requestFn
        >;

        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartBankForm counterpartId={individualId} />
          </MoniteScopedProviders>,
          cachedMoniteSDK
        );

        const countrySelectName = /country/i;

        const countryButton = await screen.findByRole('button', {
          name: countrySelectName,
        });

        await waitFor(() => expect(countryButton).not.toBeDisabled());

        triggerClickOnSelectOption(countrySelectName, 'United Kingdom');
        triggerClickOnAutocompleteOption(/currency/i, /Armenian/i);

        const submitBtn = screen.getByRole('button', {
          name: t`Add bank account`,
        });

        await act(async () => fireEvent.click(submitBtn));

        const lastCallArguments = await waitFor(() => {
          const request = requestFnMock.mock.lastCall;

          if (!request) {
            throw new Error(
              'monite.api.counterparts.createBankAccount never has been called'
            );
          }

          return request;
        });

        const [requestConfig, requestBody] = lastCallArguments;

        const serverRequestBody: components['schemas']['CreateCounterpartBankAccount'] =
          {
            account_holder_name: '',
            account_number: '',
            bic: '',
            country: AllowedCountries.GB,
            currency: CurrencyEnum.AMD,
            iban: '',
            name: '',
            routing_number: '',
            sort_code: '',
            is_default: false,
          };

        const actualRequestBody = requestBody.body;

        expect(requestConfig.url).toBe(
          '/counterparts/{counterpart_id}/bank_accounts'
        );

        expect(actualRequestBody).toEqual(serverRequestBody);
      }, 10_000);

      test('[UPDATE] should send correct request (based on server model) when perform a PATCH request (trying to update a new entity)', async () => {
        const requestFnMock = requestFn as jest.MockedFunction<
          typeof requestFn
        >;

        const firstBankListFixture = counterpartBankListFixture[0];

        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartBankForm
              counterpartId={individualId}
              bankId={firstBankListFixture.id}
            />
          </MoniteScopedProviders>,
          cachedMoniteSDK
        );

        const submitBtn = await screen.findByRole('button', {
          name: t`Update bank account`,
        });

        await waitFor(() => expect(submitBtn).not.toBeDisabled());

        fireEvent.click(submitBtn);

        const lastCallArguments = await waitFor(() => {
          const request = requestFnMock.mock.calls.find(
            (call) => call[0].method === 'patch'
          );

          if (!request) {
            throw new Error(
              'monite.api.counterparts.updateBankAccount never has been called'
            );
          }

          return request;
        });

        const [requestConfig, requestOptions] = lastCallArguments;

        console.log('Request Config:', requestConfig);
        console.log('Request Options:', requestOptions);

        const serverRequestBody: components['schemas']['UpdateCounterpartBankAccount'] =
          {
            account_holder_name: firstBankListFixture.account_holder_name,
            account_number: firstBankListFixture.account_number,
            bic: firstBankListFixture.bic,
            country:
              firstBankListFixture.country as components['schemas']['AllowedCountries'],
            currency: firstBankListFixture.currency,
            iban: firstBankListFixture.iban,
            name: firstBankListFixture.name,
            routing_number: firstBankListFixture.routing_number,
            sort_code: firstBankListFixture.sort_code,
            // @ts-expect-error - check why it's required new schema as a must for UpdateCounterpartBankAccount
            is_default: false,
          };

        const actualRequestBody = requestOptions.body;

        expect(requestConfig.method).toBe('patch');

        expect(actualRequestBody).toEqual(serverRequestBody);

        expect(requestOptions?.parameters?.path?.counterpart_id).toBe(
          individualId
        );
        expect(requestOptions?.parameters?.path?.bank_account_id).toBe(
          firstBankListFixture.id
        );
      }, 10_000);
    });
  });
});
