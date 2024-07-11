import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CounterpartAddressFormFields } from '@/components/counterparts/CounterpartDetails/CounterpartAddressForm/helpers';
import { renderWithClient } from '@/utils/test-utils';
import { screen } from '@testing-library/dom';

import { CounterpartAddressForm } from './CounterpartAddressForm';

describe('CounterpartAddressForm', () => {
  it('works without nested form context `parentField`', async () => {
    const FormWithIndividual = ({ children }: { children: ReactNode }) => {
      const methods = useForm<CounterpartAddressFormFields>({
        defaultValues: {
          city: 'city',
          country: 'DE',
          line1: 'line1',
          line2: 'line2',
          postalCode: 'postalCode',
          state: 'state',
        },
      });

      return <FormProvider {...methods}>{children}</FormProvider>;
    };

    renderWithClient(
      <FormWithIndividual>
        <CounterpartAddressForm />
      </FormWithIndividual>
    );

    expect(await screen.findByLabelText(/Address line 1/i)).toHaveValue(
      'line1'
    );
    expect(await screen.findByLabelText(/Address line 2/i)).toHaveValue(
      'line2'
    );
    expect(await screen.findByLabelText(/City/i)).toHaveValue('city');
    expect(await screen.findByLabelText(/ZIP code/i)).toHaveValue('postalCode');
    expect(
      await screen.findByLabelText(/State \/ Area \/ Province/i)
    ).toHaveValue('state');
  });

  it('works with nested form context `parentField`', async () => {
    const FormWithIndividual = ({ children }: { children: ReactNode }) => {
      const methods = useForm<{
        myCustomParentField: CounterpartAddressFormFields;
      }>({
        defaultValues: {
          myCustomParentField: {
            city: 'city',
            country: 'DE',
            line1: 'line1',
            line2: 'line2',
            postalCode: 'postalCode',
            state: 'state',
          },
        },
      });

      return <FormProvider {...methods}>{children}</FormProvider>;
    };

    renderWithClient(
      <FormWithIndividual>
        <CounterpartAddressForm parentField="myCustomParentField" />
      </FormWithIndividual>
    );

    expect(await screen.findByLabelText(/Address line 1/i)).toHaveValue(
      'line1'
    );
    expect(await screen.findByLabelText(/Address line 2/i)).toHaveValue(
      'line2'
    );
    expect(await screen.findByLabelText(/City/i)).toHaveValue('city');
    expect(await screen.findByLabelText(/ZIP code/i)).toHaveValue('postalCode');
    expect(
      await screen.findByLabelText(/State \/ Area \/ Province/i)
    ).toHaveValue('state');
  });
});
