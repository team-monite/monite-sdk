import { Dialog } from '@/components';
import { CounterpartOrganizationForm } from '@/components/counterparts/CounterpartDetails/CounterpartForm';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { organizationId } from '@/mocks/counterparts/counterpart.mocks.types';
import i18n from '@/mocks/i18n';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

describe('CounterpartOrganizationForm', () => {
  describe('# Existing Organization', () => {
    test('should show "Cancel" button if it is NOT in Dialog', async () => {
      renderWithClient(
        <CounterpartOrganizationForm id={organizationId} showCategories />
      );

      await waitUntilTableIsLoaded();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });

      expect(cancelButton).toBeInTheDocument();
    });

    test('should show "Cancel" button if it IS in Dialog', async () => {
      renderWithClient(
        <Dialog open>
          <CounterpartOrganizationForm id={organizationId} showCategories />
        </Dialog>
      );

      await waitUntilTableIsLoaded();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });

      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe('# Create new Organization', () => {
    test('should show "Cancel" button when CounterpartOrganization in Dialog component', async () => {
      renderWithClient(
        <Dialog open>
          <CounterpartOrganizationForm showCategories />
        </Dialog>
      );

      await waitUntilTableIsLoaded();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });

      expect(cancelButton).toBeInTheDocument();
    });

    test('should NOT show "Cancel" button when CounterpartOrganization NOT in Dialog component', async () => {
      renderWithClient(
        <Dialog open>
          <CounterpartOrganizationForm showCategories />
        </Dialog>
      );

      await waitUntilTableIsLoaded();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });

      expect(cancelButton).toBeInTheDocument();
    });

    test('skips "Business address" section caption if `🚫` emoji is specified', async () => {
      const customI18n = setupI18n({
        locale: i18n.locale,
        messages: {
          [i18n.locale]: {
            ...i18n.messages,
            'CounterpartDetails--CounterpartOrganizationForm--businessAddressSection--caption':
              '🚫',
          },
        },
      });

      renderWithClient(
        <I18nProvider i18n={customI18n}>
          <CounterpartOrganizationForm showCategories />
        </I18nProvider>
      );

      await waitForElementToBeRemoved(
        await screen.findAllByRole('progressbar'),
        {
          timeout: 30_000,
        }
      );

      expect(screen.queryByText('🚫')).not.toBeInTheDocument();
    });

    test('renders "Business address" section caption', async () => {
      const customI18n = setupI18n({
        locale: i18n.locale,
        messages: {
          [i18n.locale]: {
            ...i18n.messages,
            'CounterpartDetails--CounterpartOrganizationForm--businessAddressSection--caption':
              '💵 Business address',
          },
        },
      });

      renderWithClient(
        <I18nProvider i18n={customI18n}>
          <CounterpartOrganizationForm showCategories />
        </I18nProvider>
      );

      await waitForElementToBeRemoved(
        await screen.findAllByRole('progressbar'),
        {
          timeout: 30_000,
        }
      );

      expect(screen.getByText('💵 Business address')).toBeInTheDocument();
    });
  });

  describe('# Public API', () => {
    test('should call "onClose" when "Cancel" button is clicked', async () => {
      const onCancelMock = jest.fn();

      renderWithClient(
        <Dialog open onClose={onCancelMock}>
          <CounterpartOrganizationForm showCategories />
        </Dialog>
      );

      await waitUntilTableIsLoaded();

      fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

      await waitFor(() => {
        expect(onCancelMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
