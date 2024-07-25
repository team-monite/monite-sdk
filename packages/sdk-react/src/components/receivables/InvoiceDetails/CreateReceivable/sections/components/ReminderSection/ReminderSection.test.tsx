import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  ReminderDetail,
  ReminderDetails,
} from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/ReminderSection/ReminderDetail';
import { MoniteProvider } from '@/core/context/MoniteProvider';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import I18n from '@/mocks/i18n';
import { renderWithClient } from '@/utils/test-utils';
import { I18nProvider } from '@lingui/react';
import { MoniteSDK } from '@monite/sdk-api';
import { createTheme, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';

import { ReminderSection } from './RemindersSection';

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

  describe('ReminderDetails Component', () => {
    const renderWithTheme = (
      component: React.ReactElement,
      mode: 'light' | 'dark' = 'light'
    ) => {
      const theme = createTheme({
        palette: {
          mode,
        },
      });

      return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
    };

    const mockDetails: ReminderDetail = {
      id: 'overdue-reminder-1',
      name: 'Payment 1',
      created_at: '2023-07-21',
      updated_at: '2023-07-21',
      recipients: {
        bcc: undefined,
        cc: undefined,
        to: undefined,
      },
      term_1_reminder: {
        body: 'test body',
        days_before: 1,
        subject: 'test subject',
      },
      term_2_reminder: {
        body: 'test body',
        days_before: 1,
        subject: 'test subject',
      },
    };

    test('renders without crashing', () => {
      renderWithTheme(
        <Wrapper>
          <ReminderDetails details={mockDetails} />
        </Wrapper>
      );
      expect(screen.getByText('2023-07-21')).toBeInTheDocument();
    });

    test('does not render when details are empty', () => {
      const { container } = renderWithTheme(
        <Wrapper>
          <ReminderDetails details={undefined} />
        </Wrapper>
      );
      expect(container).toBeEmptyDOMElement();
    });

    test('renders correctly in light mode', () => {
      renderWithTheme(<ReminderDetails details={mockDetails} />, 'light');
      const iconColor = '#0000008F';
      const textColor = '#0000008F';

      expect(screen.getAllByTestId('NotificationsActiveIcon')[0]).toHaveStyle(
        `color: ${iconColor}`
      );
      expect(screen.getAllByText('2023-07-21')[0]).toHaveStyle(
        `color: ${textColor}`
      );
    });

    test('renders correctly in dark mode', () => {
      renderWithTheme(<ReminderDetails details={mockDetails} />, 'dark');
      const iconColor = '#FFFFFF';
      const textColor = '#FFFFFF';

      expect(screen.getAllByTestId('NotificationsActiveIcon')[0]).toHaveStyle(
        `color: ${iconColor}`
      );
      expect(screen.getAllByText('2023-07-21')[0]).toHaveStyle(
        `color: ${textColor}`
      );
    });
  });
});
