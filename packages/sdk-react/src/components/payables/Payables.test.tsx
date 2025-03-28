import { BrowserRouter } from 'react-router-dom';

import { createAPIClient } from '@/api/client';
import { Payables } from '@/components';
import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
  payableFixturePages,
} from '@/mocks';
import {
  checkPermissionQueriesLoaded,
  Provider,
  renderWithClient,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.useFakeTimers();
jest.setTimeout(10000);

const { api } = createAPIClient();

describe('Payables', () => {
  // todo::Skipped: the test is freezing because of `userEvent.upload()`, need to investigate
  test.skip('should display toast message when file upload is successful', async () => {
    const user = userEvent.setup();

    renderWithClient(
      <BrowserRouter>
        <Payables />
      </BrowserRouter>
    );

    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(t`Upload payable file`);

    expect(input).toBeInTheDocument();

    await user.upload(input, file);

    await waitFor(() =>
      expect(
        screen.findByText('Payable uploaded successfully')
      ).toBeInTheDocument()
    );
  });

  describe('# Permissions', () => {
    test('support "read" and "create" permissions', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Payables />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient), {
        timeout: 5_000,
      });
      await waitFor(() => checkPayableQueriesLoaded(queryClient), {
        timeout: 5_000,
      });

      const createPayableButton = screen.findByRole('button', {
        name: t`Add new bill`,
      });

      await expect(createPayableButton).resolves.toBeInTheDocument();
      await expect(createPayableButton).resolves.not.toBeDisabled();

      const payableCell = screen.findByText(
        payableFixturePages[0].document_id!
      );
      await expect(payableCell).resolves.toBeInTheDocument();
    });

    test('support no "read" and no "create" permissions', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      const monite = {
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      };

      render(<Payables />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} children={children} monite={monite} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));

      const createPayableButton = screen.findByRole('button', {
        name: t`Add new bill`,
      });

      await expect(createPayableButton).resolves.toBeInTheDocument();
      await expect(createPayableButton).resolves.toBeDisabled();

      await expect(
        screen.findByText(/Access Restricted/i, { selector: 'h3' })
      ).resolves.toBeInTheDocument();
    });

    test('support "allowed_for_own" access for "read" and "create" permissions', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      const monite = {
        entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      };

      render(<Payables />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} children={children} monite={monite} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient), {
        timeout: 5_000,
      });
      await waitFor(() => checkPayableQueriesLoaded(queryClient), {
        timeout: 5_000,
      });

      const createPayableButton = screen.findByRole('button', {
        name: t`Add new bill`,
      });

      await expect(createPayableButton).resolves.toBeInTheDocument();
      await expect(createPayableButton).resolves.not.toBeDisabled();

      const payableCell = screen.findByText(
        payableFixturePages[0].document_id!
      );
      await expect(payableCell).resolves.toBeInTheDocument();
    });
  });
});

function checkPayableQueriesLoaded(queryClient: QueryClient) {
  const data = api.payables.getPayables.getQueriesData({}, queryClient);

  if (!data.length) throw new Error('Payable query is not executed');
}
