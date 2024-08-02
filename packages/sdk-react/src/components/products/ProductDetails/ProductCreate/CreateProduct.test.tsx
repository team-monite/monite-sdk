import { measureUnitsListFixture } from '@/mocks';
import {
  renderWithClient,
  selectAsyncDropdownOption,
  selectAutoCompleteOption,
  triggerChangeInput,
} from '@/utils/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { CreateProduct } from './CreateProduct';

describe('CreateProduct', () => {
  describe('#FormValidation', () => {
    test('should show error message when fields are empty and form is submitted', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(<CreateProduct onCreated={onCreateMock} />);

      const saveButton = screen.getByRole('button', {
        name: /create/i,
      });

      fireEvent.click(saveButton);

      const errorMessages = await screen.findAllByText(/is a required field/i);
      expect(errorMessages.length).toBe(5);
    });

    test('should check if product radio option is selected by default', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(<CreateProduct onCreated={onCreateMock} />);

      const radioButton = screen.getByRole('radio', {
        name: /product/i,
      });

      await waitFor(() => {
        expect(radioButton).toBeChecked();
      });
    });
  });

  test('should trigger "onCreate" callback with product when we click on "save" button', async () => {
    const onCreateMock = jest.fn();

    renderWithClient(<CreateProduct onCreated={onCreateMock} />);

    triggerChangeInput(/name/i, 'test name');
    triggerChangeInput(/smallest amount/i, '1');
    triggerChangeInput(/price per unit/i, '100');
    triggerChangeInput(/description/i, 'test description');

    const dropdownButton = await screen.findByRole('combobox', {
      name: /units/i,
    });

    await waitFor(() => {
      expect(dropdownButton).not.toBeDisabled();
    });

    const measureUnit = measureUnitsListFixture.data[0].name;
    await selectAsyncDropdownOption(/units/i, measureUnit);

    await selectAutoCompleteOption(/currency/i, /Armenian/i);

    const saveButton = screen.getByRole('button', {
      name: /create/i,
    });

    fireEvent.click(saveButton);

    const errorMessages = screen.queryAllByText(/is a required field/i);
    expect(errorMessages.length).toBe(0);

    await waitFor(() => {
      expect(onCreateMock).toHaveBeenCalled();
    });
  });
});
