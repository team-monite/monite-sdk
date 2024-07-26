import { renderWithClient, triggerChangeInput } from '@/utils/test-utils';
import { requestFn } from '@openapi-qraft/react';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CreateOverdueReminder } from './CreateOverdueReminder';

const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

describe('CreateOverdueReminder', () => {
  describe('#FormValidation', () => {
    test('should show error message when fields are empty and form is submitted', async () => {
      renderWithClient(<CreateOverdueReminder />);

      const createButton = screen.getByRole('button', {
        name: /create/i,
      });

      fireEvent.click(screen.getByText(/Add reminder/i));

      fireEvent.click(createButton);

      const errorMessages = await screen.findAllByText(/is a required field/i);

      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });
  test('show reminder form when select menu item is clicked', () => {
    renderWithClient(<CreateOverdueReminder />);

    expect(screen.queryByText('Reminder 1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/Add reminder/i));

    expect(
      screen.getByRole('heading', { name: /Reminder 1/i })
    ).toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    const user = userEvent.setup();

    renderWithClient(<CreateOverdueReminder />);

    triggerChangeInput('Preset name', 'Test Reminder');

    fireEvent.click(screen.getByText(/Add reminder/i));

    fireEvent.change(screen.getByLabelText(/remind/i), {
      target: { value: '5' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Subject' }), {
      target: { value: 'Test Subject 1' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Body' }), {
      target: { value: 'Test Body 1' },
    });

    fireEvent.click(screen.getByText(/Add reminder/i));

    fireEvent.change(screen.getAllByLabelText(/remind/i)[1], {
      target: { value: '10' },
    });
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Subject' })[1], {
      target: { value: 'Test Subject 2' },
    });
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Body' })[1], {
      target: { value: 'Test Body 2' },
    });

    fireEvent.click(screen.getByText(/Add reminder/i));

    fireEvent.change(screen.getAllByLabelText(/remind/i)[2], {
      target: { value: '15' },
    });
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Subject' })[2], {
      target: { value: 'Test Subject 3' },
    });
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Body' })[2], {
      target: { value: 'Test Body 3' },
    });

    const createButton = screen.getByRole('button', {
      name: /Create/i,
    });

    await user.click(createButton);

    expect(requestFnMock.mock.lastCall?.[1].body).toMatchObject({
      name: 'Test Reminder',
      terms: [
        {
          days_after: 5,
          subject: 'Test Subject 1',
          body: 'Test Body 1',
        },
        {
          days_after: 10,
          subject: 'Test Subject 2',
          body: 'Test Body 2',
        },
        {
          days_after: 15,
          subject: 'Test Subject 3',
          body: 'Test Body 3',
        },
      ],
    });
  });
});
