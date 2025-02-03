import { renderWithClient } from '@/utils/test-utils';
import { requestFn } from '@openapi-qraft/react';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { PaymentTermsDialog } from './PaymentTermsDialog';

const closeDialogMock = jest.fn();
const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

describe('PaymentTerms', () => {
  test('should show a dialog for payment term creation', async () => {
    renderWithClient(<PaymentTermsDialog show closeDialog={closeDialogMock} />);

    expect(screen.getByText('Create payment term')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Payment due')).toBeInTheDocument();
    expect(screen.getAllByText('Description')[0]).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add discount/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelButton).toBeInTheDocument();

    await fireEvent.click(cancelButton);

    expect(closeDialogMock).toHaveBeenCalledWith();
  });

  describe('when user clicks `create` without filling the form', () => {
    test('should show error message', async () => {
      renderWithClient(
        <PaymentTermsDialog show closeDialog={closeDialogMock} />
      );

      fireEvent.click(screen.getByRole('button', { name: 'Create' }));

      await waitFor(() =>
        expect(
          screen.getByText(
            'To create a preset you need to fill out all the required fields'
          )
        ).toBeInTheDocument()
      );
    });
  });

  describe('when user fills the form', () => {
    test('should send a correct request', async () => {
      renderWithClient(
        <PaymentTermsDialog show closeDialog={closeDialogMock} />
      );

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      const paymentDueInput = screen.getByRole('spinbutton', {
        name: 'Payment due',
      });
      const descriptionInput = screen.getByRole('textbox', {
        name: 'Description',
      });

      fireEvent.change(nameInput, { target: { value: 'Standard terms' } });
      fireEvent.change(paymentDueInput, { target: { value: 14 } });
      fireEvent.change(descriptionInput, {
        target: { value: 'Pay in 14 days' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Create' }));

      await waitFor(() =>
        expect(requestFnMock.mock.lastCall?.[1].body).toEqual({
          term_final: {
            number_of_days: 14,
          },
          name: 'Standard terms',
          description: 'Pay in 14 days',
        })
      );
    });

    describe('when user adds discounts', () => {
      test('should show discount cards', async () => {
        renderWithClient(
          <PaymentTermsDialog show closeDialog={closeDialogMock} />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Add discount' }));

        expect(screen.getByText('Discount 1')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Delete' })
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Add discount' }));

        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

        expect(screen.getByText('Discount 2')).toBeInTheDocument();
        expect(deleteButtons.length).toBe(2);
        expect(deleteButtons[0]).toBeDisabled();

        fireEvent.click(deleteButtons[1]);

        expect(screen.queryByText('Discount 2')).not.toBeInTheDocument();
        expect(deleteButtons[0]).not.toBeDisabled();
      });

      test('should show correct validation messages', async () => {
        renderWithClient(
          <PaymentTermsDialog show closeDialog={closeDialogMock} />
        );

        const createButton = screen.getByRole('button', { name: 'Create' });
        const nameInput = screen.getByRole('textbox', { name: 'Name' });
        const paymentDueInput = screen.getByRole('spinbutton', {
          name: 'Payment due',
        });
        const descriptionInput = screen.getByRole('textbox', {
          name: 'Description',
        });

        fireEvent.change(nameInput, { target: { value: 'Standard terms' } });
        fireEvent.change(paymentDueInput, { target: { value: 14 } });
        fireEvent.change(descriptionInput, {
          target: { value: 'Pay in 14 days' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Add discount' }));
        fireEvent.click(createButton);

        await waitFor(() =>
          expect(
            screen.getByText(
              'To add a discount you need to fill out all the fields'
            )
          ).toBeInTheDocument()
        );

        const discount1Days = screen.getAllByRole('spinbutton')[1];
        const discount1Amount = screen.getAllByRole('spinbutton')[2];

        fireEvent.change(discount1Days, { target: { value: 15 } });
        fireEvent.change(discount1Amount, { target: { value: 20 } });

        fireEvent.click(createButton);

        await waitFor(() =>
          expect(
            screen.getByText(
              'The number of days in Discount must be less than of Due days'
            )
          ).toBeInTheDocument()
        );

        fireEvent.change(discount1Days, { target: { value: 5 } });
        fireEvent.click(screen.getByRole('button', { name: 'Add discount' }));
        fireEvent.click(createButton);

        await waitFor(() =>
          expect(
            screen.getByText(
              'To add a discount you need to fill out all the fields'
            )
          ).toBeInTheDocument()
        );

        const discount2Days = screen.getAllByRole('spinbutton')[3];
        const discount2Amount = screen.getAllByRole('spinbutton')[4];

        fireEvent.change(discount2Days, { target: { value: 3 } });
        fireEvent.change(discount2Amount, { target: { value: 10 } });
        fireEvent.click(createButton);

        await waitFor(() =>
          expect(
            screen.getByText(
              'The number of days in Discount 2 must be more than the number of Discount 1 days'
            )
          ).toBeInTheDocument()
        );
      });

      test('should send correct request', async () => {
        renderWithClient(
          <PaymentTermsDialog show closeDialog={closeDialogMock} />
        );

        const nameInput = screen.getByRole('textbox', { name: 'Name' });
        const paymentDueInput = screen.getByRole('spinbutton', {
          name: 'Payment due',
        });
        const descriptionInput = screen.getByRole('textbox', {
          name: 'Description',
        });

        fireEvent.change(nameInput, { target: { value: 'Standard terms' } });
        fireEvent.change(paymentDueInput, { target: { value: 14 } });
        fireEvent.change(descriptionInput, {
          target: { value: 'Pay in 14 days' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Add discount' }));
        fireEvent.click(screen.getByRole('button', { name: 'Add discount' }));

        const numberInputs = screen.getAllByRole('spinbutton');

        // Discount 1
        fireEvent.change(numberInputs[1], { target: { value: 5 } });
        fireEvent.change(numberInputs[2], { target: { value: 10 } });
        // Discount 2
        fireEvent.change(numberInputs[3], { target: { value: 10 } });
        fireEvent.change(numberInputs[4], { target: { value: 5 } });

        fireEvent.click(screen.getByRole('button', { name: 'Create' }));

        await waitFor(() =>
          expect(requestFnMock.mock.lastCall?.[1].body).toEqual({
            term_final: {
              number_of_days: 14,
            },
            name: 'Standard terms',
            description: 'Pay in 14 days',
            term_1: {
              number_of_days: 5,
              discount: 10,
            },
            term_2: {
              number_of_days: 10,
              discount: 5,
            },
          })
        );
      });
    });
  });

  describe('when user edits payment terms', () => {
    const selectedTerm = {
      id: '123',
      name: '30 term',
      description: 'Pay in 30 days',
      term_final: {
        number_of_days: 30,
      },
      term_1: {
        number_of_days: 15,
        discount: 10,
      },
      term_2: {
        number_of_days: 20,
        discount: 3,
      },
    };

    test('should show prefilled form', async () => {
      renderWithClient(
        <PaymentTermsDialog
          show
          closeDialog={closeDialogMock}
          selectedTerm={selectedTerm}
        />
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });

      expect(screen.getByDisplayValue(selectedTerm.name)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(selectedTerm.description)
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(selectedTerm.term_final.number_of_days)
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(selectedTerm.term_1.number_of_days)
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(selectedTerm.term_1.discount)
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(selectedTerm.term_2.number_of_days)
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(selectedTerm.term_2.discount)
      ).toBeInTheDocument();

      fireEvent.change(screen.getByDisplayValue(selectedTerm.name), {
        target: { value: 'New name' },
      });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(requestFnMock.mock.lastCall?.[1].body).toEqual({
          name: 'New name',
          description: 'Pay in 30 days',
          term_final: {
            number_of_days: 30,
          },
          term_1: {
            number_of_days: 15,
            discount: 10,
          },
          term_2: {
            number_of_days: 20,
            discount: 3,
          },
        });
        expect(requestFnMock.mock.lastCall?.[1].parameters?.path).toEqual({
          payment_terms_id: '123',
        });
      });
    });
  });
});
