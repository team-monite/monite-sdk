import { FormProvider, useForm } from 'react-hook-form';

import { MoniteProvider } from '@/core/context/MoniteProvider';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import I18n from '@/mocks/i18n';
import { I18nProvider } from '@lingui/react';
import { MoniteSDK } from '@monite/sdk-api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { ReminderSection } from './RemindersSection';

test('renders reminders correctly', async () => {
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

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
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

  render(<Wrapper>{<ReminderSection disabled={false} />}</Wrapper>);

  await waitFor(() => {
    console.log('Payment Reminders:', screen.getByText('Reminder 1'));
    console.log('Overdue Reminders:', screen.getByText('Overdue Reminder 1'));

    expect(screen.getByText('Before due date')).toBeInTheDocument();
    expect(screen.getByText('Overdue reminders')).toBeInTheDocument();
  });
});
