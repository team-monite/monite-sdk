import { components } from '@/api';
import { CounterpartContactView } from '@/components/counterparts/CounterpartDetails/CounterpartView/CounterpartContactView';
import { ENTITY_ID_FOR_LOW_PERMISSIONS } from '@/mocks';
import {
  counterpartsContactsFixtures,
  counterpartsAddressesFixture,
  counterpartIndividualFixture,
} from '@/mocks/counterparts';
import {
  individualId,
  organizationId,
} from '@/mocks/counterparts/counterpart.mocks.types';
import {
  renderWithClient,
  triggerChangeInput,
  triggerClickOnAutocompleteOption,
  triggerClickOnSelectOption,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { i18n as i18nCore } from '@lingui/core';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CounterpartDataTestId } from '../Counterpart.types';
import { CounterpartDetails } from './CounterpartDetails';
import {
  getActionButtonInAddressSection,
  getActionButtonInContactSection,
  getActionButtonInDeleteModal,
  findFirstActionButtonInBankAccountSection,
  findEditButtonInIndividualSection,
  getEditButtonInOrganizationSection,
  getDeleteButtonInIndividualSection,
  getFirstBankAccountFixture,
} from './CounterpartTestHelpers';

const user = userEvent.setup();

describe('CounterpartDetails', () => {
  describe('# Existing counterpart', () => {
    describe('# Interface', () => {
      test('should display first & last names in a proper inputs when we click on "edit" button', async () => {
        renderWithClient(<CounterpartDetails id={individualId} />);

        await waitUntilTableIsLoaded();

        const editButton = await findEditButtonInIndividualSection(i18nCore);

        fireEvent.click(editButton);

        expect(
          screen.getByRole('textbox', {
            name: /first name/i,
          })
        ).toHaveValue(counterpartIndividualFixture.individual.first_name);

        expect(
          screen.getByRole('textbox', {
            name: /last name/i,
          })
        ).toHaveValue(counterpartIndividualFixture.individual.last_name);
      });

      test('should display category when `showCategories` in not provided', async () => {
        renderWithClient(<CounterpartDetails id={individualId} />);

        await waitUntilTableIsLoaded();

        const categorySection = await screen.findByText(/Category/i);

        expect(categorySection).toBeInTheDocument();
      });

      test('should display category when we provided `showCategories` as `true`', async () => {
        renderWithClient(
          <CounterpartDetails id={individualId} showCategories={true} />
        );

        await waitUntilTableIsLoaded();

        const categorySection = await screen.findByText(/Category/i);

        expect(categorySection).toBeInTheDocument();
      });

      test('should NOT display category when we provided `showCategories` as `false`', async () => {
        renderWithClient(
          <CounterpartDetails id={individualId} showCategories={false} />
        );

        await waitUntilTableIsLoaded();

        const categorySection = screen.findByText(/Category/i);

        await expect(categorySection).rejects.toThrowError(
          /Unable to find an element/i
        );
      });

      test('should NOT display bank accounts information when we provided `showBankAccounts` as `false`', async () => {
        renderWithClient(
          <CounterpartDetails id={individualId} showBankAccounts={false} />
        );

        await waitUntilTableIsLoaded();

        const bankAccountSection = screen.findByTestId(
          CounterpartDataTestId.BankAccount
        );

        await expect(bankAccountSection).rejects.toThrowError(
          /Unable to find an element/i
        );
      });

      test('should display bank accounts information when we DID NOT provide `showBankAccounts` because it should be by default', async () => {
        renderWithClient(<CounterpartDetails id={individualId} />);

        await waitUntilTableIsLoaded();

        const bankAccountSection = await screen.findByTestId(
          CounterpartDataTestId.BankAccount
        );

        expect(bankAccountSection).toBeInTheDocument();
      });

      test('should display bank accounts information when we provided `showBankAccounts` as `true`', async () => {
        renderWithClient(
          <CounterpartDetails id={individualId} showBankAccounts={true} />
        );

        await waitUntilTableIsLoaded();

        const bankAccountSection = await screen.findByTestId(
          CounterpartDataTestId.BankAccount
        );

        expect(bankAccountSection).toBeInTheDocument();
      });

      test('should display address information when we click on "edit" in Address section', async () => {
        renderWithClient(<CounterpartDetails id={individualId} />);

        await waitUntilTableIsLoaded();

        const editButton = await getActionButtonInAddressSection(
          'edit',
          i18nCore
        );

        fireEvent.click(editButton);

        const addressLineField = screen.getByRole('textbox', {
          name: 'Address line 1',
        });

        expect(addressLineField).toBeInTheDocument();
      });

      test('should NOT show "Delete" button if the user has no permissions to delete counterpart', async () => {
        const monite = new MoniteSDK({
          entityId: ENTITY_ID_FOR_LOW_PERMISSIONS,
          fetchToken: () =>
            Promise.resolve({
              access_token: 'token',
              token_type: 'Bearer',
              expires_in: 3600,
            }),
        });

        renderWithClient(<CounterpartDetails id={individualId} />, monite);

        await waitUntilTableIsLoaded();

        const infoSection = await screen.findByTestId(
          CounterpartDataTestId.IndividualView
        );

        const deleteButton = within(infoSection).queryByRole('button', {
          name: /delete/i,
        });

        expect(deleteButton).not.toBeInTheDocument();
      });
    });

    describe('# Actions', () => {
      describe('# Organization information', () => {
        test('should trigger "onUpdate" callback when we click on "save" button in edit menu', async () => {
          const onUpdateMock = jest.fn();

          renderWithClient(
            <CounterpartDetails id={organizationId} onUpdate={onUpdateMock} />
          );

          await waitUntilTableIsLoaded();

          const editButton = await getEditButtonInOrganizationSection(i18nCore);
          fireEvent.click(editButton);

          const updateButton = screen.getByRole('button', {
            name: /Update/i,
          });
          fireEvent.click(updateButton);

          await waitFor(() => {
            expect(onUpdateMock).toHaveBeenCalledWith(organizationId);
          });
        });
      });

      describe('# Individual information', () => {
        test('should trigger "onUpdate" callback when we click on "save" button in edit menu', async () => {
          const onUpdateMock = jest.fn();

          renderWithClient(
            <CounterpartDetails id={individualId} onUpdate={onUpdateMock} />
          );

          await waitUntilTableIsLoaded();

          const editButton = await findEditButtonInIndividualSection(i18nCore);

          fireEvent.click(editButton);

          const firstNameInput = screen.getByRole('textbox', {
            name: /First name/i,
          });
          fireEvent.change(firstNameInput, {
            target: {
              value: 'Updated first name',
            },
          });

          const updateButton = screen.getByRole('button', {
            name: /Update/i,
          });

          fireEvent.click(updateButton);

          await waitFor(() => {
            expect(onUpdateMock).toHaveBeenCalledWith(individualId);
          });
        });

        test('should trigger "onDelete" callback when we click on "delete" button in menu', async () => {
          const onDeleteMock = jest.fn();

          renderWithClient(
            <CounterpartDetails id={individualId} onDelete={onDeleteMock} />
          );

          await waitUntilTableIsLoaded();

          const deleteMenuButton = await getDeleteButtonInIndividualSection(
            i18nCore
          );
          fireEvent.click(deleteMenuButton);

          const deleteButtonInModal = await getActionButtonInDeleteModal(
            'delete',
            i18nCore
          );

          fireEvent.click(deleteButtonInModal);

          await waitFor(() => {
            expect(onDeleteMock).toHaveBeenCalledWith(individualId);
          });
        });
      });

      describe('# Bank Account', () => {
        test('should trigger "onBankUpdate" callback when we click on "edit" button in bank accounts menu', async () => {
          const onBankUpdateMock = jest.fn();

          renderWithClient(
            <CounterpartDetails
              id={individualId}
              onBankUpdate={onBankUpdateMock}
              showBankAccounts
            />
          );

          await waitUntilTableIsLoaded();

          const editButton = await findFirstActionButtonInBankAccountSection(
            'edit',
            i18nCore
          );

          fireEvent.click(editButton);

          const updateButtonText = t`Update bank account`;
          const updateButton = await screen.findByText(updateButtonText);

          await user.click(updateButton);

          const bankAccountFixture = getFirstBankAccountFixture();

          await waitFor(() => {
            expect(onBankUpdateMock).toHaveBeenCalledWith(
              bankAccountFixture.id
            );
          });
        });

        test('should trigger "onBankDelete" callback when we click on "delete" button in bank accounts menu', async () => {
          const onBankDeleteMock = jest.fn();

          renderWithClient(
            <CounterpartDetails
              id={individualId}
              onBankDelete={onBankDeleteMock}
              showBankAccounts
            />
          );

          await waitUntilTableIsLoaded();

          const deleteButton = await findFirstActionButtonInBankAccountSection(
            'delete',
            i18nCore
          );

          fireEvent.click(deleteButton);

          const deleteButtonInModal = await getActionButtonInDeleteModal(
            'delete',
            i18nCore
          );

          fireEvent.click(deleteButtonInModal);

          const bankAccountFixture = getFirstBankAccountFixture();

          await waitFor(() => {
            expect(onBankDeleteMock).toHaveBeenCalledWith(
              bankAccountFixture.id
            );
          });
        });

        test('should trigger "onBankCreate" callback when we click on "create" button in bank accounts menu', async () => {
          const onBankCreateMock = jest.fn();

          renderWithClient(
            <CounterpartDetails
              id={individualId}
              onBankCreate={onBankCreateMock}
              showBankAccounts
            />
          );

          await waitUntilTableIsLoaded();

          const createButton = await findFirstActionButtonInBankAccountSection(
            'create',
            i18nCore
          );
          fireEvent.click(createButton);

          triggerChangeInput(/account name/i, '[create] Account name');
          triggerChangeInput(/iban/i, '[create] Iban');
          triggerChangeInput(/bic/i, '[create] Bic');
          triggerClickOnSelectOption(/country/i, 'Armenia');
          triggerClickOnAutocompleteOption(/currency/i, /Armenian/i);

          const submitButton = screen.getByRole('button', {
            name: 'Add bank account',
          });
          fireEvent.click(submitButton);

          await waitFor(() => {
            expect(onBankCreateMock).toHaveBeenCalledWith('2');
          });
        }, 10_000);

        test('should NOT trigger "onBankCreate" callback when we click on "create" button in bank accounts menu because the form is invalid', async () => {
          const onBankCreateMock = jest.fn();

          renderWithClient(
            <CounterpartDetails
              id={individualId}
              onBankCreate={onBankCreateMock}
              showBankAccounts
            />
          );

          await waitUntilTableIsLoaded();

          const createButton = await findFirstActionButtonInBankAccountSection(
            'create',
            i18nCore
          );
          fireEvent.click(createButton);

          const submitButton = screen.getByRole('button', {
            name: 'Add bank account',
          });
          fireEvent.click(submitButton);

          /**
           * The errors should be visible on the next tick of RaF (request animation frame).
           *  Because of that we have to wait until they become visible
           */
          const errors = await screen.findAllByText(/ required/);

          expect(errors.length).toBeGreaterThanOrEqual(2);

          expect(onBankCreateMock).not.toHaveBeenCalled();
        });
      });

      describe('# Address', () => {
        test('should trigger "onAddressUpdate" callback when we click on "update" button in addresses menu', async () => {
          const onAddressUpdateMock = jest.fn();

          renderWithClient(
            <CounterpartDetails
              id={individualId}
              onAddressUpdate={onAddressUpdateMock}
            />
          );

          await waitUntilTableIsLoaded();

          const editButton = await getActionButtonInAddressSection(
            'edit',
            i18nCore
          );
          fireEvent.click(editButton);

          const updateButton = await getActionButtonInAddressSection(
            'update',
            i18nCore
          );
          fireEvent.click(updateButton);

          const addresses = counterpartsAddressesFixture.find((counterpart) =>
            counterpart.data.find(
              (address) => address.counterpart_id === individualId
            )
          );

          if (!addresses) {
            throw new Error(
              `Could not find addresses by provided id: ${individualId}`
            );
          }

          const address = addresses.data[0];

          await waitFor(() => {
            expect(onAddressUpdateMock).toHaveBeenCalledWith(address.id);
          });
        });
      });

      describe('# Contact persons', () => {
        test('should trigger "onContactUpdate" callback when we click on "update" in contact details', async () => {
          const onContactUpdateMock = jest.fn();

          renderWithClient(
            <CounterpartDetails
              id={organizationId}
              onContactUpdate={onContactUpdateMock}
            />
          );

          await waitUntilTableIsLoaded();

          const editButton = await getActionButtonInContactSection(
            'edit',
            i18nCore
          );
          fireEvent.click(editButton);

          const updateContactText = t`Update contact`;
          const updateContactButton = await screen.findByRole('button', {
            name: updateContactText,
          });

          await user.click(updateContactButton);

          const firstFixture = counterpartsContactsFixtures[organizationId][0];

          await waitFor(() => {
            expect(onContactUpdateMock).toHaveBeenCalledWith(firstFixture.id);
          });
        });

        test('should trigger "onContactDelete" callback when we click on "delete" in contact details', async () => {
          const onContactDeleteMock = jest.fn();

          renderWithClient(
            <CounterpartDetails
              id={organizationId}
              onContactDelete={onContactDeleteMock}
            />
          );

          await waitUntilTableIsLoaded();

          const deleteButton = await getActionButtonInContactSection(
            'delete',
            i18nCore
          );
          fireEvent.click(deleteButton);

          const deleteButtonInModal = await getActionButtonInDeleteModal(
            'delete',
            i18nCore
          );
          fireEvent.click(deleteButtonInModal);

          /** The first fixture is not removable because it has `is_default=true` and it can't be deleted */
          const firstRemovableFixture =
            counterpartsContactsFixtures[organizationId][1];

          await waitFor(() => {
            expect(onContactDeleteMock).toHaveBeenCalledWith(
              firstRemovableFixture.id
            );
          });
        });

        test('should has no "delete" button on default contact', async () => {
          const onContactDeleteMock = jest.fn();

          renderWithClient(
            <CounterpartDetails
              id={organizationId}
              onContactDelete={onContactDeleteMock}
            />
          );

          await waitUntilTableIsLoaded();

          const section = await screen.findByTestId(
            CounterpartDataTestId.ContactPerson
          );

          const allButtons = await within(section).findAllByRole('button', {
            name: t`Delete`,
          });

          expect(allButtons.length).toBeGreaterThanOrEqual(1);
        });
      });
    });
  });

  describe('# New counterpart', () => {
    describe('# Interface', () => {
      describe('# Organisation', () => {
        test('should mark `isCustomer` as `true` and `isVendor` as `true` when we provided `defaultValues` is provided', async () => {
          renderWithClient(
            <CounterpartDetails
              type={'organization'}
              defaultValues={{
                isCustomer: true,
                isVendor: true,
              }}
            />
          );

          await waitUntilTableIsLoaded();

          const checkboxes: Array<HTMLInputElement> =
            screen.getAllByRole('checkbox');

          expect(checkboxes.map((checkbox) => checkbox.checked)).toEqual([
            true,
            true,
            false,
          ]);
        });
      });

      test('should NOT create create organization when the form is invalid', async () => {
        const onCreateMock = jest.fn();

        renderWithClient(
          <CounterpartDetails type={'organization'} onCreate={onCreateMock} />
        );

        await waitUntilTableIsLoaded();

        const createButton = screen.getByRole('button', {
          name: t`Create`,
        });

        await user.click(createButton);

        const errors = await screen.findAllByText(/is required/i);

        expect(errors.length).toBeGreaterThan(2);
        expect(onCreateMock).not.toHaveBeenCalled();
      });
    });

    describe('# Individual', () => {
      test('should mark `isCustomer` as `true` and `isVendor` as `true` when we provided `defaultValues` is provided', async () => {
        renderWithClient(
          <CounterpartDetails
            type={'individual'}
            defaultValues={{
              isCustomer: true,
              isVendor: true,
            }}
          />
        );

        await waitUntilTableIsLoaded();

        const checkboxes: Array<HTMLInputElement> =
          screen.getAllByRole('checkbox');

        expect(checkboxes.map((checkbox) => checkbox.checked)).toEqual([
          true,
          true,
          false,
        ]);
      });

      test('should NOT mark `isCustomer` as `true` and `isVendor` as `true` when we provided `defaultValues` is NOT provided', async () => {
        renderWithClient(<CounterpartDetails type={'individual'} />);

        await waitUntilTableIsLoaded();

        const checkboxes: Array<HTMLInputElement> =
          screen.getAllByRole('checkbox');

        expect(checkboxes.map((checkbox) => checkbox.checked)).toEqual([
          false,
          false,
          false,
        ]);
      });
    });
  });

  describe('CounterpartContactView', () => {
    const renderContactView = (email: string, isDefault: boolean) => {
      const contact = {
        id: 'contact-uuid-1',
        counterpart_id: 'counterpart-uuid-1',
        email,
        first_name: 'Mary',
        last_name: "O'Brien",
        is_default: isDefault,
        phone: '5551235476',
        title: 'Ms.',
        address: {
          country: 'DE' as components['schemas']['AllowedCountries'],
          city: 'Berlin',
          postal_code: '10115',
          state: 'string',
          line1: 'Flughafenstrasse 52',
          line2: 'string',
        },
      };

      renderWithClient(
        <CounterpartContactView
          contact={contact}
          permissions={{ isUpdateAllowed: true, isDeleteAllowed: true }}
        />
      );

      return screen.getByText(email);
    };

    test('should display "default" label next to the matching email when contact is marked as default', async () => {
      const matchingEmail = 'test@example.com';

      const emailElement = renderContactView(matchingEmail, true);
      const defaultLabel = within(emailElement.parentElement!).queryByText(
        /default/i
      );

      expect(defaultLabel).toBeInTheDocument();
      expect(defaultLabel).toBeVisible();
    });

    test('should NOT display "default" label when email does not match or contact is not marked as default', async () => {
      const nonMatchingEmail = 'different@example.com';

      const emailElement = renderContactView(nonMatchingEmail, false);
      const defaultLabel = within(emailElement.parentElement!).queryByText(
        /default/i
      );

      expect(defaultLabel).not.toBeInTheDocument();
    });
  });
});
