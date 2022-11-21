import { within, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithClient } from 'utils/test-utils';
import { counterpartOrganizationFixture, counterpartBankFixture } from 'mocks';
import i18nEn from 'core/i18n/en.json';

import CounterpartBankForm from './CounterpartBankForm';
import { CounterpartBankFormProps } from './useCounterpartBankForm';

const counterpartName = counterpartOrganizationFixture.organization.legal_name;
const counterpartActions = i18nEn.counterparts.actions;

const defaultProps: CounterpartBankFormProps = {
  counterpartId: 'organization',
  onCancel: jest.fn(),
  onCreate: jest.fn(),
  onUpdate: jest.fn(),
};

export const renderBankForm = (
  props: Partial<CounterpartBankFormProps> = defaultProps
) => renderWithClient(<CounterpartBankForm {...defaultProps} {...props} />);

const user = userEvent.setup();

export const fillBankForm = async () => {
  await user.type(screen.getByRole('textbox', { name: /name/i }), 'name');

  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('name');
  });

  await user.type(screen.getByRole('textbox', { name: /iban/i }), 'iban');

  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: /iban/i })).toHaveValue('iban');
  });

  await user.type(screen.getByRole('textbox', { name: /bic/i }), 'bic');

  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: /bic/i })).toHaveValue('bic');
  });
};

describe('CounterpartBankForm', () => {
  test('should create a bank account', async () => {
    renderBankForm();

    await waitFor(() => {
      expect(screen.getByText(counterpartName)).toBeInTheDocument();
    });

    await waitFor(() => {
      const title = within(screen.getByTestId('bankName'));
      expect(
        title.getByText(counterpartActions.createBank)
      ).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', {
      name: counterpartActions.createBank,
    });

    expect(submitBtn).toBeInTheDocument();

    await fillBankForm();

    await user.click(submitBtn);

    await waitFor(() => {
      expect(defaultProps.onCreate).toHaveBeenCalledWith(
        counterpartBankFixture.id
      );
    });
  });

  test('should update bank', async () => {
    renderBankForm({ bankId: counterpartBankFixture.id });

    await waitFor(() => {
      expect(screen.getByText(counterpartName)).toBeInTheDocument();
    });

    await waitFor(() => {
      const { getByText } = within(screen.getByTestId('bankName'));
      expect(
        getByText(counterpartBankFixture.name as string)
      ).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', {
      name: counterpartActions.updateBank,
    });

    expect(submitBtn).toBeInTheDocument();

    await user.click(submitBtn);

    await waitFor(() => {
      expect(defaultProps.onUpdate).toHaveBeenCalledWith(
        counterpartBankFixture.id
      );
    });
  });

  test('should catch onCancel callback', async () => {
    renderBankForm();

    await waitFor(() => {
      expect(screen.getByText(counterpartName)).toBeInTheDocument();
    });

    const cancelBtn = screen.getByRole('button', {
      name: counterpartActions.cancel,
    });

    expect(cancelBtn).toBeInTheDocument();

    await user.click(cancelBtn);

    await waitFor(() => {
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });
});
