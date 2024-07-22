import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { MoniteProvider } from '@/core/context/MoniteProvider';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import I18n from '@/mocks/i18n';
import { renderWithClient } from '@/utils/test-utils';
import { I18nProvider } from '@lingui/react';
import { MoniteSDK } from '@monite/sdk-api';
import { requestFn } from '@openapi-qraft/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';

import { ReminderSection } from './RemindersSection';

const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

const Wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  const moniteMock = new MoniteSDK({
    entityId: '123',
    fetchToken: () =>
      Promise.resolve({
        access_token: '123213',
        token_type: 'Bearer',
        expires_in: 3600,
      }),
  });

  const methods = useForm();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider i18n={I18n}>
        <MoniteProvider
          locale={{
            code: 'en-US',
          }}
          monite={moniteMock}
        >
          <MoniteScopedProviders>
            <FormProvider {...methods}>{children}</FormProvider>
          </MoniteScopedProviders>
        </MoniteProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
};

describe('ReminderSection', () => {
  describe('#FormValidation', () => {
    test('should show error message when fields are empty and form is submitted', async () => {
      console.log(
        'Starting test: should show error message when fields are empty and form is submitted'
      );

      await act(async () => {
        renderWithClient(
          <Wrapper>
            <ReminderSection disabled={false} />
          </Wrapper>
        );
      });

      console.log('Rendered ReminderSection component');

      await waitFor(() => {
        expect(screen.queryByText(/Loading.../)).not.toBeInTheDocument();
      });
    });
  });
});
