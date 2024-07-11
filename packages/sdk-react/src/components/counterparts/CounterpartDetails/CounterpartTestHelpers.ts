import { counterpartBankListFixture } from '@/mocks/counterparts';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { screen, waitFor, within } from '@testing-library/react';

import { CounterpartDataTestId } from '../Counterpart.types';

export async function getActionButtonInDeleteModal(
  action: 'cancel' | 'delete',
  i18n: I18n
): Promise<HTMLElement> {
  const section = await screen.findByLabelText(t(i18n)`Delete confirmation`);

  if (action === 'delete') {
    const deleteModalText = t(i18n)`Delete`;

    const deleteButton = within(section).getByRole('button', {
      name: deleteModalText,
    });

    await waitFor(() => {
      expect(deleteButton.hasAttribute('disabled')).toBe(false);
    });

    return deleteButton;
  } else {
    const cancelModalText = t(i18n)`Cancel`;

    return within(section).getByRole('button', {
      name: cancelModalText,
    });
  }
}

export async function getActionButtonInAddressSection(
  action: 'edit' | 'update',
  i18n: I18n
): Promise<HTMLElement> {
  if (action === 'edit') {
    const section = await screen.findByTestId(CounterpartDataTestId.Address);

    return within(section).getByRole('button', {
      name: t(i18n)`Edit`,
    });
  } else {
    return await screen.findByRole('button', {
      name: t(i18n)`Update`,
    });
  }
}

export async function getActionButtonInContactSection(
  action: 'edit' | 'delete',
  i18n: I18n
): Promise<HTMLElement> {
  const section = await screen.findByTestId(
    CounterpartDataTestId.ContactPerson
  );

  const buttonText = (() => {
    switch (action) {
      case 'edit': {
        return t(i18n)`Edit`;
      }

      case 'delete': {
        return t(i18n)`Delete`;
      }
    }
  })();

  const allButtons = await within(section).findAllByRole('button', {
    name: buttonText,
  });

  return allButtons[0];
}

export async function findEditButtonInIndividualSection(
  i18n: I18n
): Promise<HTMLElement> {
  const section = await screen.findByTestId(
    CounterpartDataTestId.IndividualView
  );

  return within(section).getByRole('button', {
    name: t(i18n)`Edit`,
  });
}

export async function getEditButtonInOrganizationSection(
  i18n: I18n
): Promise<HTMLElement> {
  const section = await screen.findByTestId(
    CounterpartDataTestId.OrganizationView
  );

  return within(section).getByRole('button', {
    name: t(i18n)`Edit`,
  });
}

export async function getDeleteButtonInIndividualSection(
  i18n: I18n
): Promise<HTMLElement> {
  const section = await screen.findByTestId(
    CounterpartDataTestId.IndividualView
  );

  return within(section).getByRole('button', {
    name: t(i18n)`Delete`,
  });
}

export async function findFirstActionButtonInBankAccountSection(
  action: 'edit' | 'delete' | 'create',
  i18n: I18n
): Promise<HTMLElement> {
  const section = await screen.findByTestId(CounterpartDataTestId.BankAccount);

  const buttonText = (() => {
    switch (action) {
      case 'edit':
        return t(i18n)`Edit`;
      case 'delete':
        return t(i18n)`Delete`;
      case 'create':
        return t(i18n)`Add bank account`;
    }
  })();

  const allButtons = await within(section).findAllByRole('button', {
    name: buttonText,
  });

  return allButtons[0];
}

export function getFirstBankAccountFixture() {
  return counterpartBankListFixture[0];
}
