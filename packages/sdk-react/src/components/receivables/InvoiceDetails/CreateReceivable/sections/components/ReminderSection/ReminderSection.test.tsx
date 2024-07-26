import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useValidateCounterpart } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/ReminderSection/hooks/useValidateCounterpart';
import { ReminderSection } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/ReminderSection/RemindersSection';
import { MoniteProvider } from '@/core/context/MoniteProvider';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import I18n from '@/mocks/i18n';
import { I18nProvider } from '@lingui/react';
import { MoniteSDK } from '@monite/sdk-api';
import { createTheme, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

jest.mock('./hooks/useValidateCounterpart');

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
        <MoniteProvider locale={{ code: 'en-US' }} monite={moniteMock}>
          <MoniteScopedProviders>
            <FormProvider {...methods}>{children}</FormProvider>
          </MoniteScopedProviders>
        </MoniteProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
};

describe('ReminderSection', () => {
  const renderWithTheme = (
    component: React.ReactElement,
    mode: 'light' | 'dark' = 'light'
  ) => {
    const theme = createTheme({
      palette: { mode },
    });
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
  };

  test('does not render when details are empty', () => {
    const { container } = renderWithTheme(
      <Wrapper>
        <ReminderSection disabled={false} />
      </Wrapper>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders with reminders disabled alert', async () => {
    (useValidateCounterpart as jest.Mock).mockReturnValue({
      areRemindersEnabled: false,
      isEmailValid: true,
    });

    renderWithTheme(
      <Wrapper>
        <ReminderSection disabled={false} />
      </Wrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Reminders are disabled for this counterpart/i)
      ).toBeInTheDocument();
    });
  });

  test('renders with invalid email alert', async () => {
    (useValidateCounterpart as jest.Mock).mockReturnValue({
      areRemindersEnabled: true,
      isEmailValid: false,
    });

    renderWithTheme(
      <Wrapper>
        <ReminderSection disabled={false} />
      </Wrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No default email for selected Counterpart/i)
      ).toBeInTheDocument();
    });
  });
});
